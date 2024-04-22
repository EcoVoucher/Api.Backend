const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', function(e) {
    e.preventDefault();

    let user = {
        identidade: document.getElementById('identidade').value,
        senha: document.getElementById('senha1').value
    };

    fetch(`/api/usuario/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then((response) => response.json()).then((data) => {
        alert("Login realizado com sucesso!");
        window.location.href = `/indexPegada.html?token=${data._id}`;
    }).catch((error) => {
        alert("Erro ao cadastrar usuário!");
        console.error('Erro ao cadastrar usuário:', error);
    });
});
