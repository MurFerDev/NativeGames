
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
    const response = await fetch('http://localhost:3306/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.error || 'Erro no login.');
        return;
    }

    // Armazena o token no localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    alert('Login bem-sucedido!');
    window.location.href = 'hub.html'; // Redireciona para o hub do usuário

    } catch (err) {
    console.error('Erro ao fazer login:', err);
    alert('Erro ao se conectar com o servidor.');
    }
});