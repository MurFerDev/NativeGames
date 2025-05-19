// server.js - Ponto de entrada do backend

require('dotenv').config();
console.log('DB_USER:', process.env.DB_USER); // <-- TESTE

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const hubRoutes = require('./routes/hub.routes');
const favoritosRoutes = require('./routes/favoritos.routes');
const logRoutes = require('./routes/logRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3306;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.use('/api/auth', authRoutes);
app.use('/api/usuario', userRoutes);
app.use('/api/hub', hubRoutes);
app.use('/api/favoritos', favoritosRoutes);

// Rota para adminitradores
app.use('/api/logs', logRoutes);
app.use('/api/admin', adminRoutes);

// Rota raiz para teste rápido
app.get('/', (req, res) => {
  res.send('Servidor Node.js rodando!');
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
