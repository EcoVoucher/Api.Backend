const formCadastro = document.getElementById('form-cadastro')

formCadastro.addEventListener('submit', function(e) {
    e.preventDefault();
    const inputs = formCadastro.querySelectorAll('input');

    let user = {};
    inputs.forEach((input) => {
        switch (input.name) {
            case "cpf":
                if (input.value != "") {
                    if (input.value.length !== 14 && input.value.length !== 0) {
                        alert("CPF inválido!");
                        return;
                    }

                    user.cpf = input.value;
                    user.cnpj = "";
                }
                break;
            case "cep":
                if (!validarCEP(input.value)) {
                    alert("CEP inválido!");
                    return;
                }

                user.cep = parseInt(input.value);
                break;
            case "cnpj":
                if (input.value != "") {
                    if (input.value.length !== 14 && input.value.length !== 0) {
                        alert("CNPJ inválido!");
                        return;
                    }
                    user.cnpj = input.value;
                    user.cpf = "";
                }
                break;
            case "nome":
                if (input.value != "") {
                    user.nome = input.value;
                }
                break;
            case "nomeEmpresa":
                if (input.value != "") {
                    user.nomeEmpresa = input.value;
                }
                break;
            case "email":
                user.email = input.value;
                break;
            case "telefone":
                user.telefone = input.value;
                break;
            case "enderecoCompleto":
                user.endereco = input.value;
                user.numero = document.getElementById('numero').value;
                user.complemento = document.getElementById('complemento').value;
                break;
            case "senha":
                user.senha = input.value;
                break;
            case "dataNascimento":
                user.dataNascimento = input.value;
                break;
        }
    });
    fetch(`/api/usuario/cadastro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then((response) => response.json()).then((data) => {
        alert("Usuário cadastrado com sucesso!");
        window.location.href = '/login.html';
    }).catch((error) => {
        alert("Erro ao cadastrar usuário!");
        console.error('Erro ao cadastrar usuário:', error);
    });
});

function limparFormulario() {
    const inputs = formCadastro.querySelectorAll('input');
    inputs.forEach((input) => {
        input.value = '';
    });
}

document.getElementById('pessoa-juridica').addEventListener('click', () => {
    limparFormulario();
    document.getElementById('nomeEmpresa').disabled = false;
    document.getElementById('nomeEmpresa').required = true;
    document.getElementById('cnpj').disabled = false;
    document.getElementById('cnpj').required = true;
    document.getElementById('nome').disabled = true;
    document.getElementById('nome').required = false;
    document.getElementById('cpf').disabled = true;
    document.getElementById('cpf').required = false;
    document.getElementById('dataNascimento').disabled = true;
    document.getElementById('dataNascimento').required = false;
});

document.getElementById('pessoa-fisica').addEventListener('click', () => {
    limparFormulario();
    document.getElementById('nomeEmpresa').disabled = true;
    document.getElementById('nomeEmpresa').required = false;
    document.getElementById('dataNascimento').disabled = false;
    document.getElementById('dataNascimento').required = true;
    document.getElementById('cnpj').disabled = true;
    document.getElementById('cnpj').required = false;
    document.getElementById('nome').disabled = false;
    document.getElementById('nome').required = true;
    document.getElementById('cpf').disabled = false;
    document.getElementById('cpf').required = true;
});

function validarCEP(cep) {
    const regexCEP = /^[0-9]{5}-?[0-9]{3}$/;
    return regexCEP.test(cep);
}

function buscarEnderecoPorCEP() {
    const cep = document.getElementById('cep').value;
    if (validarCEP(cep)) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`).then((response) => response.json()).then((data) => {
            let enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf} - ${data.cep}`;
            document.getElementById('enderecoCompleto').value = enderecoCompleto;
            document.getElementById('enderecoCompleto').disabled = true;
        }).catch((error) => {
            console.error('Erro ao buscar CEP:', error);
        });
    } else {
        alert("Digite um cep válido!");
    }
}
