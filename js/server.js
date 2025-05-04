// server.js - Inicializa o backend com Node.js + Express + MySQL + JWT

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.SECKEY_JWT || '';

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com banco de dados MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_native_games'
});

db.connect(error => {
  if (error) {
    console.error('Erro ao conectar no banco de dados:', error);
  } else {
    console.log('Conectado ao banco de dados MySQL.');
  }
});

// Middleware para verificar token JWT
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, jwtSecret, (err, usuario) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });
    req.usuario = usuario;
    next();
  });
}

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Native Games rodando...');
});

// Teste deleitura do .env
app.get('/env-test', (req, res) => {
  res.json({
    db_host: process.env.DB_HOST,
    db_user: process.env.DB_USER,
    db_name: process.env.DB_NAME,
    jwt_secret: process.env.SECKEY_JWT,
    port: process.env.PORT
  });
});

// Rota de cadastro de usuário
app.post('/api/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const checkQuery = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(checkQuery, [email], async (checkErr, results) => {
    if (checkErr) {
      console.error('Erro ao verificar e-mail:', checkErr);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    const insertQuery = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    db.query(insertQuery, [nome, email, hashedPassword], (insertErr, result) => {
      if (insertErr) {
        console.error('Erro ao cadastrar usuário:', insertErr);
        return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
      }
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: result.insertId });
    });
  });
});

// Rota de login com geração de token JWT
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const usuario = results[0];
    const match = await bcrypt.compare(senha, usuario.senha);

    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      jwtSecret,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login bem-sucedido',
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
  });
});

// Rota protegida de exemplo
app.get('/api/hub', autenticarToken, (req, res) => {
  res.status(200).json({
    message: `Bem-vindo ao seu hub, ${req.usuario.nome}!`,
    usuario: req.usuario
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = db;
