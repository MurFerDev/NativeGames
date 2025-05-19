const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const autenticarToken = require('../middleware/authMiddleware');

const jwtSecret = process.env.JWT_SECRET;

// Registrar novo usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  db.query('SELECT * FROM tb_usuario WHERE email = ?', [email_usuario], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor.' });
    if (results.length > 0) return res.status(409).json({ error: 'E-mail já cadastrado.' });

    const hashedPassword = await bcrypt.hash(senha, 10);
    db.query('INSERT INTO tb_usuario (nome, email, senha) VALUES (?, ?, ?)', [nome_usuario, email_usuario, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    });
  });
});

// Login de usuário
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'E-mail e senha obrigatórios.' });

  db.query('SELECT * FROM tb_usuario WHERE email = ?', [email_usuario], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Usuário não encontrado.' });

    const usuario = results[0];
    const match = await bcrypt.compare(senha, senha_hash_usuario);
    if (!match) return res.status(401).json({ error: 'Senha incorreta.' });

    const token = jwt.sign({ id: id_usuario, nome: nome_usuario, email: email_usuario,    tipo_usuario: tipo_usuario }, jwtSecret, { expiresIn: '2h' });
    res.status(200).json({ token, usuario: { id: id_usuario, nome: nome_usuario, email: email_usuario } });

      // Sucesso:
    db.query('INSERT INTO tb_log_acesso (fk_usuario, email_tentado, status_acesso, ip_origem, navegador) VALUES (?, ?, ?, ?, ?)',
      [id_usuario, email, 'sucesso', req.ip, req.headers['user-agent']]
    );
    
    // Falha:
    db.query('INSERT INTO tb_log_acesso (email_tentado, status_acesso, ip_origem, navegador) VALUES (?, ?, ?, ?)',
      [email, 'falha', req.ip, req.headers['user-agent']]
    );
  });

});

// Editar nome/senha do usuário
router.put('/editar', autenticarToken, async (req, res) => {
  const { nome, senha } = req.body;
  const usuarioId = req.id_usuario;

  if (!nome && !senha) return res.status(400).json({ error: 'Informe ao menos um campo.' });

  const campos = [];
  const valores = [];

  if (nome) {
    campos.push('nome = ?');
    valores.push(nome);
  }

  if (senha) {
    const hashed = await bcrypt.hash(senha, 10);
    campos.push('senha = ?');
    valores.push(hashed);
  }

  valores.push(usuarioId);
  const sql = `UPDATE tb_usuario SET ${campos.join(', ')} WHERE id = ?`;

  db.query(sql, valores, (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    res.json({ message: 'Perfil atualizado com sucesso.' });
  });
});

module.exports = router;
