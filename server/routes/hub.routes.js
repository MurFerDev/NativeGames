const express = require('express');
const autenticarToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/hub', autenticarToken, (req, res) => {
  res.status(200).json({
    message: `Bem-vindo ao seu hub, ${req.usuario.nome}!`,
    usuario: req.usuario
  });
});

module.exports = router;
