const express = require('express');
const router = express.Router();
const db = require('../database/db'); // ajuste o caminho conforme necessário

const autenticarToken = require('../middleware/authMiddleware');
const verificarAdmin = require('../middleware/adminMiddleware');

// Listar todos os usuários
router.get('/usuarios', autenticarToken, verificarAdmin, (req, res) => {
  const sql = 'SELECT id_usuario, nome_usuario, email_usuario, apelido_usuario, tipo_usuario FROM tb_usuario ORDER BY id_usuario';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuários' });
    res.json({ usuarios: results });
  });
});

// Excluir usuário por ID
router.delete('/usuarios/:id', autenticarToken, verificarAdmin, (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM tb_usuario WHERE id_usuario = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao excluir usuário' });
    res.json({ message: 'Usuário excluído com sucesso.' });
  });
});

// Alterar tipo de usuário
router.post('/usuarios/tipo', autenticarToken, verificarAdmin, (req, res) => {
  const { id_usuario, tipo_usuario } = req.body;
  if (!['admin', 'comum'].includes(tipo_usuario)) {
    return res.status(400).json({ error: 'Tipo de usuário inválido.' });
  }

  const sql = 'UPDATE tb_usuario SET tipo_usuario = ? WHERE id_usuario = ?';
  db.query(sql, [tipo_usuario, id_usuario], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar tipo de usuário.' });
    res.json({ message: 'Tipo de usuário atualizado com sucesso.' });
  });
});