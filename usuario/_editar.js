import { getUsuario, postAutenticado } from '../js/utils/api.js';

const usuario = getUsuario();
const senhaInput = document.querySelector('#senha');
const forcaSenhaEl = document.querySelector('#forcaSenha');
const telefoneInput = document.querySelector('#telefone');


if (!usuario) {
    alert('Sessão expirada. Faça login novamente.');
    window.location.href = '../login.html';
}

const form = document.querySelector('#formEditar');

document.querySelector('#nome').value = usuario.nome_usuario;
document.querySelector('#apelido').value = usuario.apelido_usuario;
document.querySelector('#email').value = usuario.email_usuario;
document.querySelector('#telefone').value = usuario.telefone_usuario || '';

senhaInput.addEventListener('input', () => {
    const senha = senhaInput.value;

    const tem10 = senha.length >= 10;
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[^A-Za-z0-9]/.test(senha);

    if (!senha) {
        forcaSenhaEl.textContent = 'Digite sua nova senha';
        forcaSenhaEl.className = 'form-text text-muted font-weight-bold';
        return;
    }

    const nivel = tem10 + temNumero + temEspecial;

    if (!tem10 || !temNumero || !temEspecial) {
        forcaSenhaEl.textContent = 'Senha fraca: mínimo 10 caracteres, 1 número e 1 caractere especial.';
        forcaSenhaEl.className = 'form-text text-danger font-weight-bold';
    } else if (nivel === 3 && senha.length >= 14) {
        forcaSenhaEl.textContent = 'Senha forte!';
        forcaSenhaEl.className = 'form-text text-success font-weight-bold';
    } else {
        forcaSenhaEl.textContent = 'Senha aceitável.';
        forcaSenhaEl.className = 'form-text text-warning font-weight-bold';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.querySelector('#nome').value.trim();
    const apelido = document.querySelector('#apelido').value.trim();
    
    let telefone = document.querySelector('#telefone').value;
    telefone = telefone.replace(/\s+/g, '').replace(/[^0-9()-]/g, '');
    const regexTel = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

    if (telefone && !regexTel.test(telefone)) {
        return alert('Telefone inválido. Use o formato (11) 91234-5678.');
    }
    
    if (!nome && !apelido && !senha && !telefone) {
        return alert('Preencha ao menos um campo.');
    }

    const senha = document.querySelector('#senha').value;
    const confirmaSenha = document.querySelector('#confirmaSenha').value;

    if (senha) {
        const tem10 = senha.length >= 10;
        const temNumero = /[0-9]/.test(senha);
        const temEspecial = /[^A-Za-z0-9]/.test(senha);

        if (!tem10 || !temNumero || !temEspecial) {
            return alert('A senha deve conter ao menos 10 caracteres, incluindo número e caractere especial.');
        }

        if (senha && senha !== confirmaSenha) {
            return alert('As senhas não coincidem. Verifique e tente novamente.');
            }

        dados.senha = senha;
    }

    const dados = { nome, apelido, telefone };
    if (senha.length >= 10) dados.senha = senha;

    try {
        const res = await postAutenticado('http://localhost:3306/api/usuario/editar', dados);
        alert('Perfil atualizado com sucesso!');
        window.location.href = '../server/admin/admin-dashboard.html';
    } catch (err) {
        console.error(err);
        alert('Erro ao atualizar perfil.');
    }
});

// Preview do upload da foto de perfil
document.querySelector('#fotoPerfil').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.querySelector('#previewFoto').src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Controle de visibilidade durante o input no campo senha
document.querySelector('#toggleSenha').addEventListener('click', () => {
  const senha = document.querySelector('#senha');
  senha.type = senha.type === 'password' ? 'text' : 'password';
});

// Máscara do campo telefone
telefoneInput.addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');

    if (valor.length > 11) valor = valor.slice(0, 11);

    if (valor.length <= 10) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

  e.target.value = valor.trim();
});

// Impede digitação de letras diretamente no campo telefone
telefoneInput.addEventListener('keypress', function (e) {
  const char = String.fromCharCode(e.which);
  if (!/[0-9]/.test(char)) {
    e.preventDefault();
  }
});

// Prevenir colagem de caracteres inválidos no campo telefone
telefoneInput.addEventListener('paste', function (e) {
  const texto = (e.clipboardData || window.clipboardData).getData('text');
  if (/\D/.test(texto)) {
    e.preventDefault();
    alert('Cole apenas números no campo de telefone.');
  }
});