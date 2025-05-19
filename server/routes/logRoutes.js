const express = require('express');
const router = express.Router();
const db = require('../database/db');
const autenticarToken = require('../middleware/authMiddleware');
const verificarAdmin = require('../middleware/adminMiddleware');

// Ver logs de acesso
router.get('/acessos', autenticarToken, verificarAdmin, (req, res) => {
  db.query('SELECT * FROM tb_log_acesso ORDER BY data_hora DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar logs de acesso.' });
    res.status(200).json({ logs: results });
  });
});

// Ver logs de ações dos usuários
router.get('/acoes', autenticarToken, verificarAdmin, (req, res) => {
  db.query(`SELECT l.*, u.apelido_usuario FROM tb_log_acao_usuario l
    JOIN tb_usuario u ON u.id_usuario = l.fk_usuario
    ORDER BY l.data_hora DESC
  `, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar logs de ações.' });
    res.status(200).json({ logs: results });
  });
});

module.exports = router;