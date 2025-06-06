import { getUsuario, logout } from '../js/utils/api.js';
/*
const usuario = getUsuario();

if (!usuario || usuario.tipo_usuario !== 'admin') {
  alert('Acesso restrito ao painel administrativo.');
  logout();
  window.location.href = '../index.html';
} else {
  const nome = usuario.apelido_usuario || usuario.nome_usuario || 'Administrador';
  document.querySelector('#boasVindas').textContent = `Olá, ${nome}`;
  document.querySelector('#usuarioNomeDropdown').textContent = nomeExibicao;
}
*/
document.querySelector('#logoutBtn').addEventListener('click', logout);


// Alimentação da Dashboard do painel Administrativo

async function carregarDashboard() {
  try {
    const res = await getAutenticado('http://localhost:3306/api/admin/dashboard');

    document.querySelector('#totalJogos').textContent = res.totalJogos[0].total;
    document.querySelector('#totalUsuarios').textContent = res.totalUsuarios[0].total;
    document.querySelector('#totalAcessos').textContent = res.totalAcessos[0].total;

    // Horários
    new Chart(document.querySelector('#graficoHoras'), {
      type: 'bar',
      data: {
        labels: res.horarios.map(h => `${h.hora}:00`),
        datasets: [{
          label: 'Acessos por Hora',
          data: res.horarios.map(h => h.total),
          backgroundColor: '#007bff'
        }]
      }
    });

    // Localidades (simulação via faixa IP)
    new Chart(document.querySelector('#graficoLocalidades'), {
      type: 'doughnut',
      data: {
        labels: res.locais.map(l => `IP: ${l.faixa_ip}.*`),
        datasets: [{
          data: res.locais.map(l => l.total),
          backgroundColor: ['#17a2b8', '#ffc107', '#28a745', '#dc3545', '#6c757d', '#6610f2']
        }]
      }
    });

    // Dispositivos/Navegadores
    new Chart(document.querySelector('#graficoDispositivos'), {
      type: 'pie',
      data: {
        labels: res.navegadores.map(n => n.navegador),
        datasets: [{
          data: res.navegadores.map(n => n.total),
          backgroundColor: ['#f0ad4e', '#5bc0de', '#5cb85c', '#d9534f', '#343a40']
        }]
      }
    });
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar dashboard.');
  }
}

document.querySelector('#logoutBtn').addEventListener('click', logout);

carregarDashboard();



// Variáveis para a Dashboard do painel administrativo
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const autenticarToken = require('../middleware/authMiddleware');
const verificarAdmin = require('../middleware/adminMiddleware');

// Dashboard do painel administrativo
router.get('/dashboard', autenticarToken, verificarAdmin, (req, res) => {
  const consultas = {
    totalJogos: 'SELECT COUNT(*) AS total FROM tb_jogo',
    totalUsuarios: 'SELECT COUNT(*) AS total FROM tb_usuario',
    totalAcessos: 'SELECT COUNT(*) AS total FROM tb_log_acesso',
    horarios: `
      SELECT HOUR(data_hora) AS hora, COUNT(*) AS total
      FROM tb_log_acesso
      GROUP BY HOUR(data_hora)
    `,
    locais: `
      SELECT SUBSTRING_INDEX(ip_origem, '.', 1) AS faixa_ip, COUNT(*) AS total
      FROM tb_log_acesso
      GROUP BY faixa_ip
      LIMIT 6
    `,
    navegadores: `
      SELECT
        CASE
          WHEN navegador LIKE '%Chrome%' THEN 'Chrome'
          WHEN navegador LIKE '%Firefox%' THEN 'Firefox'
          WHEN navegador LIKE '%Safari%' THEN 'Safari'
          WHEN navegador LIKE '%Edg%' THEN 'Edge'
          ELSE 'Outros'
        END AS navegador,
        COUNT(*) AS total
      FROM tb_log_acesso
      GROUP BY navegador
    `
  };

  const results = {};
  let pendentes = Object.keys(consultas).length;

  Object.entries(consultas).forEach(([key, sql]) => {
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json({ error: `Erro na consulta ${key}` });
      results[key] = data;
      if (--pendentes === 0) res.json(results);
    });
  });
});

module.exports = router;