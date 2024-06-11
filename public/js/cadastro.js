document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('form-cadastro');

    // Configurações de formulário para Pessoa Física e Jurídica
    document.getElementById('pessoa-fisica').addEventListener('click', configurarFormularioParaPessoaFisica);
    document.getElementById('pessoa-juridica').addEventListener('click', configurarFormularioParaPessoaJuridica);

    // Inicialização com base no tipo selecionado
    const tipoInicial = document.querySelector('input[name="tipoCliente"]:checked').id;
    if (tipoInicial === 'pessoa-fisica') {
        configurarFormularioParaPessoaFisica();
    } else {
        configurarFormularioParaPessoaJuridica();
    }

    // Adiciona eventos de validação aos campos
    const inputsValidacao = ['nome', 'cpf', 'telefone', 'cep', 'nomeEmpresa', 'cnpj', 'senha', 'confirmarSenha'];
    inputsValidacao.forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => validarCampo(input));
            input.addEventListener('blur', () => validarCampo(input));
        }
    });

    // Adiciona evento de submissão do formulário
    formCadastro.addEventListener('submit', function (e) {
        e.preventDefault();
        processarFormulario(formCadastro);
    });

    // Configura visibilidade da senha
    document.getElementById('toggle-senha').addEventListener('click', () => {
        togglePasswordVisibility('senha', 'toggle-senha');
    });

    document.getElementById('toggle-confirmarSenha').addEventListener('click', () => {
        togglePasswordVisibility('confirmarSenha', 'toggle-confirmarSenha');
    });
});

// Alternar visibilidade da senha
function togglePasswordVisibility(fieldId, toggleId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = document.querySelector(`#${toggleId} i`);

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

// Função para validar campos
function validarCampo(input) {
    let mensagemErro = "";
    switch (input.id) {
        case "nome":
            if (!validarNome(input.value)) {
                mensagemErro = "Nome inválido! Apenas letras e espaços são permitidos.";
            }
            break;
        case "cpf":
            if (!validarCPF(input.value)) {
                mensagemErro = "CPF inválido!";
            }
            break;
        case "telefone":
            if (!validarTelefone(input.value)) {
                mensagemErro = "Telefone inválido! Apenas números são permitidos e deve ter 10 ou 11 dígitos.";
            }
            break;
        case "cep":
            if (!validarCEP(input.value)) {
                mensagemErro = "CEP inválido!";
            }
            break;
        case "nomeEmpresa":
            if (input.value && !validarNome(input.value)) {
                mensagemErro = "Nome da Empresa inválido! Apenas letras e espaços são permitidos.";
            }
            break;
        case "cnpj":
            if (input.value && !validarCNPJ(input.value)) {
                mensagemErro = "CNPJ inválido!";
            }
            break;
        case "senha":
            if (!validarSenha(input.value)) {
                mensagemErro = "Senha inválida! Deve ter entre 8 e 20 caracteres, incluindo letras maiúsculas e minúsculas, números e caracteres especiais.";
            }
            break;
        case "confirmarSenha":
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            if (confirmarSenha !== senha) {
                mensagemErro = "As senhas não coincidem!";
            }
            break;
    }
    mostrarErro(input, mensagemErro);
}

// Função para mostrar erros nos campos
function mostrarErro(input, mensagemErro) {
    const errorDiv = document.getElementById(`error-${input.id}`);
    if (errorDiv) {
        if (mensagemErro) {
            errorDiv.textContent = mensagemErro;
            errorDiv.classList.add('active');
        } else {
            errorDiv.textContent = '';
            errorDiv.classList.remove('active');
        }
    }
}

function processarFormulario(formCadastro) {
    const inputs = formCadastro.querySelectorAll('input');
    let user = {};
    let erro = false;

    inputs.forEach((input) => {
        let mensagemErro = "";
        switch (input.name) {
            case "cpf":
                if (input.value) {
                    if (!validarCPF(input.value)) {
                        mensagemErro = "CPF inválido!";
                        erro = true;
                    }
                    user.cpf = input.value;
                    user.cnpj = "";
                }
                break;
            case "cep":
                if (!validarCEP(input.value)) {
                    mensagemErro = "CEP inválido!";
                    erro = true;
                }
                user.cep = parseInt(input.value.replace(/\D/g, ''));
                break;
            case "cnpj":
                if (input.value) {
                    if (!validarCNPJ(input.value)) {
                        mensagemErro = "CNPJ inválido!";
                        erro = true;
                    }
                    user.cnpj = input.value;
                    user.cpf = "";
                }
                break;
            case "nome":
                if (input.value) {
                    if (!validarNome(input.value)) {
                        mensagemErro = "Nome inválido! Apenas letras e espaços são permitidos.";
                        erro = true;
                    }
                    user.nome = input.value;
                }
                break;
            case "nomeEmpresa":
                if (input.value) {
                    if (!validarNome(input.value)) {
                        mensagemErro = "Nome da Empresa inválido! Apenas letras e espaços são permitidos.";
                        erro = true;
                    }
                    user.nomeEmpresa = input.value;
                }
                break;
            case "email":
                user.email = input.value;
                break;
            case "telefone":
                if (input.value) {
                    if (!validarTelefone(input.value)) {
                        mensagemErro = "Telefone inválido! Apenas números são permitidos e deve ter 10 ou 11 dígitos.";
                        erro = true;
                    }
                    user.telefone = input.value;
                }
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
            case "senha":
                if (!validarSenha(input.value)) {
                    erro = true;
                }
                break;
            case "confirmarSenha":
                const senha = document.getElementById('senha').value;
                const confirmarSenha = document.getElementById('confirmarSenha').value;
                if (confirmarSenha !== senha) {
                    erro = true;
                }
                break;
        }
        mostrarErro(input, mensagemErro);
    });

    if (erro) {
        mostrarMensagemErro("Corrija os erros no formulário antes de enviar.");
        return;
    }

    enviarDados(user);
}

function enviarDados(user) {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    fetch(`/api/user/cadastro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then((response) => {
        if (!response.ok) {
            return response.text().then((text) => {
                let errorMessage = text;
                try {
                    const json = JSON.parse(text);
                    errorMessage = json.message || `Erro: ${response.status}`;
                } catch (e) {
                    // Não é JSON, provavelmente HTML
                }
                throw new Error(errorMessage);
            });
        }
        return response.json();
    }).then((data) => {
        mostrarMensagemSucesso("Usuário cadastrado com sucesso!");
        window.location.href = '/login.html';
    }).catch((error) => {
        mostrarMensagemErro(`Erro ao cadastrar usuário: ${error.message}`);
        console.error('Erro ao cadastrar usuário:', error);
    }).finally(() => {
        submitButton.disabled = false;
    });
}

function limparFormulario() {
    document.getElementById('form-cadastro').reset();
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');
    esconderMensagem();
}

function mostrarMensagemErro(mensagem) {
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.textContent = mensagem;
        messageBox.className = 'alert error';
        messageBox.style.display = 'block';
    }
}

function mostrarMensagemSucesso(mensagem) {
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.textContent = mensagem;
        messageBox.className = 'alert success';
        messageBox.style.display = 'block';
    }
}

function esconderMensagem() {
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.style.display = 'none';
    }
}

function validarCPF(cpf) {
    // Remove qualquer caracter não numérico
    const apenasNumeros = cpf.replace(/\D/g, '');

    // Verifica se o CPF tem exatamente 11 dígitos
    if (apenasNumeros.length !== 11) {
        return false;
    }

    // Verifica se todos os caracteres são números
    const regexCPF = /^\d{11}$/;
    return regexCPF.test(apenasNumeros);
}

function validarCNPJ(cnpj) {
    const regexCNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return regexCNPJ.test(cnpj);
}

function validarCEP(cep) {
    const regexCEP = /^[0-9]{5}-?[0-9]{3}$/;
    return regexCEP.test(cep);
}

function validarNome(nome) {
    const regexNome = /^[A-Za-zÀ-ú\s]+$/;
    return regexNome.test(nome);
}

function validarTelefone(telefone) {
    const regexTelefone = /^[0-9]{10,11}$/;
    return regexTelefone.test(telefone);
}

function validarSenha(password) {
    // A senha deve ter pelo menos 8 caracteres, incluindo letras, números e pelo menos um caractere especial
    const minLength = 8;
    const hasLetters = /[A-Za-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    return (
        password.length >= minLength &&
        hasLetters &&
        hasNumbers &&
        hasSpecial
    );
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
        mostrarMensagemErro("Digite um CEP válido!");
    }
}

function configurarFormularioParaPessoaJuridica() {
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

    mostrarErro(document.getElementById('nome'), '');
    mostrarErro(document.getElementById('cpf'), '');
    mostrarErro(document.getElementById('dataNascimento'), '');
    esconderMensagem();
}

function configurarFormularioParaPessoaFisica() {
    document.getElementById('nomeEmpresa').disabled = true;
    document.getElementById('nomeEmpresa').required = false;
    document.getElementById('cnpj').disabled = true;
    document.getElementById('cnpj').required = false;

    document.getElementById('nome').disabled = false;
    document.getElementById('nome').required = true;
    document.getElementById('cpf').disabled = false;
    document.getElementById('cpf').required = true;
    document.getElementById('dataNascimento').disabled = false;
    document.getElementById('dataNascimento').required = true;

    mostrarErro(document.getElementById('nomeEmpresa'), '');
    mostrarErro(document.getElementById('cnpj'), '');
    esconderMensagem();
}
