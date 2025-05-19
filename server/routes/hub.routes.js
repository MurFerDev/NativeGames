const express = require('express');
const router = express.Router();
const db = require('../database/db');
const autenticarToken = require('../middleware/authMiddleware');


router.get('/dados', autenticarToken, (req, res) => {
  const usuarioId = req.usuario.tipo_usuario === 'admin' && req.query.id ? req.query.id : req.usuario.id;

  const query = `
    SELECT j.nome AS jogo, j.imagem, e.vitorias, e.derrotas, e.partidas
    FROM favoritos f
    JOIN jogos j ON f.jogo_id = j.id
    LEFT JOIN estatisticas e ON e.jogo_id = j.id AND e.usuario_id = f.usuario_id
    WHERE f.usuario_id = ?
  `;

  db.query(query, [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar dados do hub.' });
    res.status(200).json({ jogos: results });
  });

  registrarAcao(req.id_usuario, 'Visualizou hub de usuário', '/api/hub/dados', 'GET');
});

module.exports = router;
