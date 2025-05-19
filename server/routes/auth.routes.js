const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const router = express.Router();
const jwtSecret = process.env.SECKEY_JWT || '';

// Cadastro
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const checkQuery = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(checkQuery, [email_usuario], async (checkErr, results) => {
    if (checkErr) return res.status(500).json({ error: 'Erro no servidor.' });

    if (results.length > 0) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    const insertQuery = 'INSERT INTO tb_usuario (nome_usuario, email_usuario, senha_usuario) VALUES (?, ?, ?)';
    db.query(insertQuery, [nome_usuario, email_usuario, hashedPassword], (insertErr, result) => {
      if (insertErr) return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
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

  const query = 'SELECT * FROM tb_usuario WHERE email = ?';
  db.query(query, [email_usuario], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const usuario = results[0];
    const match = await bcrypt.compare(senha, senha_hash_usuario);

    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: id_usuario, nome: nome_usuario, apelido_usuario: apelido_usuario, email: email_usuario },
      jwtSecret,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login bem-sucedido',
      token,
      usuario: { id: id_usuario, nome: nome_usuario, apelido_usuario: apelido_usuario, email: email_usuario }
    });
  });
});