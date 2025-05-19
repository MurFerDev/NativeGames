/* const db = require('../database/db');

function registrarAcao(usuarioId, acao, rota, metodo) {
  const sql = `
    INSERT INTO tb_log_acao_usuario (fk_usuario, acao, rota_afetada, metodo_http)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [usuarioId, acao, rota, metodo], (err) => {
    if (err) console.error('Erro ao registrar ação de usuário:', err);
  });
}

module.exports = registrarAcao;
*/