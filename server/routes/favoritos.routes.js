const express = require('express');
const router = express.Router();
const db = require('../database/db');
const autenticarToken = require('../middleware/authMiddleware');

// Adicionar jogo aos favoritos
router.post('/', autenticarToken, (req, res) => {
  const usuarioId = req.id_usuario;
  const { jogo_id } = req.body;

  if (!jogo_id) {
    return res.status(400).json({ error: 'ID do jogo é obrigatório.' });
  }

  const insert = 'INSERT INTO tb_favorito (usuario_id, id_jogo) VALUES (?, ?)';
  db.query(insert, [usuarioId, jogo_id], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar favorito:', err);
      return res.status(500).json({ error: 'Erro ao adicionar favorito.' });
    }
    res.status(200).json({ message: 'Jogo adicionado aos favoritos com sucesso!' });
  });

  registrarAcao(req.id_usuario, `Adicionou jogo ID ${jogo_id} aos favoritos`, '/api/favoritos', 'POST');
});

// Remover jogo dos favoritos
router.delete('/:jogo_id', autenticarToken, (req, res) => {
  const usuarioId = req.id_usuario;
  const jogoId = req.params.jogo_id;

  const del = 'DELETE FROM tb_favorito WHERE usuario_id = ? AND jogo_id = ?';
  db.query(del, [usuarioId, jogoId], (err, result) => {
    if (err) {
      console.error('Erro ao remover favorito:', err);
      return res.status(500).json({ error: 'Erro ao remover favorito.' });
    }
    res.status(200).json({ message: 'Jogo removido dos favoritos com sucesso!' });
  });

  registrarAcao(req.id_usuario, `Removeu jogo ID ${jogoId} dos favoritos`, `/api/favoritos/${jogoId}`, 'DELETE');
});

module.exports = router;
