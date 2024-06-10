document.addEventListener('DOMContentLoaded', function () {
    const cookieData = getCookie('contato');
    if (cookieData) {
        const formData = JSON.parse(cookieData);
        addLinhaTabela(formData);
    }
});

// Inicialmente desativar todos os campos exceto o primeiro
document.getElementById('email').disabled = true;
document.getElementById('telefone').disabled = true;
document.getElementById('tipo').disabled = true;


document.getElementById('formulario-contato').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Obter valores dos campos
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const tipo = document.getElementById('tipo').value;
    const mensagem = document.getElementById('mensagem').value;

    // Limpar mensagens de erro anteriores
    document.getElementById('nome-erro').style.display = 'none';
    document.getElementById('email-erro').style.display = 'none';
    document.getElementById('telefone-erro').style.display = 'none';
    document.getElementById('mensagem-erro').style.display = 'none';

    let valid = true;
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    // Validações
    if (!nome) {
        document.getElementById('nome-erro').innerText = 'Nome é obrigatório.';
        document.getElementById('nome-erro').style.display = 'block';
        console.log('Nome é obrigatório.');
        valid = false;
    } else if (!regex.test(nome)) {
        document.getElementById('nome-erro').innerText = 'Nome inválido, permitido somente letras.';
        document.getElementById('nome-erro').style.display = 'block';
        console.log('Nome inválido, permitido somente letras.');
        valid = false;
    }

    if (!email || !validateEmail(email)) {
        document.getElementById('email-erro').innerText = 'E-mail inválido.';
        document.getElementById('email-erro').style.display = 'block';
        console.log('E-mail inválido.');
        valid = false;
    }

    if (!telefone || !validarTelefone(telefone)) {
        document.getElementById('telefone-erro').innerText = 'Telefone é inválido. Formato esperado: (DD) XXXX-XXXX ou (DD) XXXXX-XXXX';
        document.getElementById('telefone-erro').style.display = 'block';
        console.log('Telefone é obrigatório ou inválido.');
        valid = false;
    }

    if (!mensagem) {
        document.getElementById('mensagem-erro').innerText = 'Mensagem é obrigatória.';
        document.getElementById('mensagem-erro').style.display = 'block';
        console.log('Mensagem é obrigatória.');
        valid = false;
    }

    if (!valid) {
        return;
    }

    // Dados para enviar
    const dados = {
        name: nome,
        email: email,
        telefone: telefone,
        tipo: parseInt(tipo),
        mensagem: mensagem
    };

    // Log dos dados a serem enviados
    console.log("Dados para enviar:", JSON.stringify(dados));

    // Enviar dados para o servidor
    try {
        const response = await fetch('http://localhost:4000/api/contato', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            const result = await response.json();

            setCookie(`contato_${result.id_contato}`, JSON.stringify(dados), 1);
            getCookie('contato');
            alert('Mensagem enviada com sucesso! Sua mensagem poderá ser editada em até 1 hora!');

            // Limpar o formulário
            document.getElementById('formulario-contato').reset(); // Substitua 'meuFormulario' pelo ID do seu formulário

        } else {
            const error = await response.json();
            console.error('Erro do servidor:', error); // Log do erro do servidor
            alert(`Erro: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error); // Log do erro
        alert('Erro ao enviar a mensagem. Por favor, tente novamente mais tarde.');
    }
});

// Validação em tempo real
document.getElementById('nome').addEventListener('input', function () {
    const nome = this.value.trim();
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if (nome && regex.test(nome)) {
        document.getElementById('nome-erro').style.display = 'none';
        document.getElementById('email').disabled = false; // Ativar o próximo campo
    } else {
        document.getElementById('nome-erro').innerText = 'Nome é obrigatório e deve conter somente letras.';
        document.getElementById('nome-erro').style.display = 'block';
        document.getElementById('email').disabled = true; // Desativar o próximo campo
    }
});

document.getElementById('email').addEventListener('input', function () {
    const email = this.value.trim();

    if (email && validateEmail(email)) {
        document.getElementById('email-erro').style.display = 'none';
        document.getElementById('telefone').disabled = false; // Ativar o próximo campo
    } else {
        document.getElementById('email-erro').innerText = 'E-mail inválido.';
        document.getElementById('email-erro').style.display = 'block';
        document.getElementById('telefone').disabled = true; // Desativar o próximo campo
    }
});

document.getElementById('telefone').addEventListener('input', function () {
    const telefone = this.value.trim();

    if (telefone && validarTelefone(telefone)) {
        document.getElementById('telefone-erro').style.display = 'none';
        document.getElementById('tipo').disabled = false; // Ativar o próximo campo
    } else {
        document.getElementById('telefone-erro').innerText = 'Telefone é inválido. Formato esperado:(DD) XXXX-XXXX ou (DD) XXXXX-XXXX';
        document.getElementById('telefone-erro').style.display = 'block';
        document.getElementById('tipo').disabled = true; // Desativar o próximo campo
    }
});


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validarTelefone(telefone) {
    // Verifica se o telefone é fornecido
    if (!telefone) {
        return false;
    }

    // Verifica o comprimento do telefone (deve ser 14 ou 15 caracteres)
    if (telefone.length !== 14 && telefone.length !== 15) {
        return false;
    }

    // Verifica o formato dos caracteres especiais
    if (telefone[0] !== '(' || telefone[3] !== ')' || telefone[telefone.length - 5] !== '-') {
        return false;
    }

    // Função auxiliar para verificar se um caractere é um dígito
    function isDigit(char) {
        return char >= '0' && char <= '9';
    }

    // Verifica os dois primeiros dígitos (código de área)
    for (let i = 1; i <= 2; i++) {
        if (!isDigit(telefone[i])) {
            return false;
        }
    }

    // Verifica os dígitos principais
    // Índices para números de 8 ou 9 dígitos
    let start = telefone.length === 15 ? 5 : 5; // 5º caractere sempre é um dígito
    let end = telefone.length === 15 ? 9 : 8; // 9º para números de 11 dígitos, 8º para números de 10 dígitos

    for (let i = start; i <= end; i++) {
        if (!isDigit(telefone[i])) {
            return false;
        }
    }

    // Verifica os últimos quatro dígitos
    for (let i = telefone.length - 4; i < telefone.length; i++) {
        if (!isDigit(telefone[i])) {
            return false;
        }
    }

    // Se passou por todas as verificações, é válido
    return true;
}

document.getElementById('editar-contato').addEventListener('click', async function (event) {
    event.preventDefault();
    let id_contato = this.getAttribute('data-id-contato');
    const dados = {
        name: document.getElementById('modal-nome').value,
        email: document.getElementById('modal-email').value.trim(),
        telefone: document.getElementById('modal-telefone').value.trim(),
        mensagem: document.getElementById('modal-mensagem').value
    };

    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        } 
    });
    
    let error = null;

    if (!dados.name) {
        Toast.fire({
            icon: "error",
            title: "Nome é obrigatório."
        });
        
        error = true;
    } else if (!regex.test(dados.name)) {
        Toast.fire({
            icon: "error",
            title: "Nome inválido, permitido somente letras."
        });

        error = true;
    }

    if (!dados.telefone || !validarTelefone(dados.telefone)) {
        Toast.fire({
            icon: "error",
            title: "Telefone é inválido. Formato esperado: (DD) XXXX-XXXX ou (DD) XXXXX-XXXX"
        });

        error = true;
    }

    if (error) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/contato/${id_contato}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            const result = await response.json();
            modalEditarContato.hide();
            alert(result.message);
            deleteCookie(`contato_${id_contato}`);
            getCookie('contato');
        } else {
            const error = await response.json();
            console.error('Erro do servidor:', error); // Log do erro do servidor
            alert(`Erro: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error); // Log do erro
        alert('Erro ao enviar a mensagem. Por favor, tente novamente mais tarde.');
    }
});

const modalEditarContato = new bootstrap.Modal(document.getElementById('modalEditarContato'));
async function editarContato(button) {
    let id_contato = button.getAttribute('data-id-contato');
    try {
        const response = await fetch(`http://localhost:4000/api/contato/${id_contato}`, {
            method: 'GET'
        });

        if (response.ok) {
            const result = await response.json();
            modalEditarContato.show();
            document.getElementById('modal-nome').value = result.name;
            document.getElementById('modal-email').value = result.email;
            document.getElementById('modal-telefone').value = result.telefone;
            document.getElementById('modal-mensagem').value = result.mensagem;

            document.getElementById('editar-contato').setAttribute('data-id-contato', id_contato);
        } else {
            const error = await response.json();
            console.error('Erro do servidor:', error); // Log do erro do servidor
            alert(`Erro: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error); // Log do erro
        alert('Erro ao enviar a mensagem. Por favor, tente novamente mais tarde.');
    }
}
document.getElementById('editar-contato').addEventListener('click', function () {
    const modal = document.getElementById('modalEditarContato');
    modal.addEventListener('shown.bs.modal', function () {
        document.getElementById('modal-nome').focus();
    });
});


function setCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const cookieValue = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
    console.log("Setting cookie:", cookieValue); // Log do valor do cookie
    document.cookie = cookieValue;
}

function getCookie(name) {
    limparTabela();
    const values = document.cookie.split(';');
    for (let i = 0; i < values.length; i++) {
        let value = values[i].trim();
        if (value.startsWith(name + '_')) {
            const parts = value.split('=');
            const id_contato = parts[0].split('_')[1];
            const cookieContent = decodeURIComponent(parts[1]);
            console.log("Reading cookie content:", cookieContent); // Log do conteúdo do cookie
            const conteudo_cookie = JSON.parse(cookieContent);
            addLinhaTabela(id_contato, conteudo_cookie);
        }
    }
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function addLinhaTabela(id_contato, dados) {
    const tableBody = document.getElementById('table-contato').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    newRow.value = id_contato;

    const nameLinha = newRow.insertCell(0);
    const emailLinha = newRow.insertCell(1);
    const telefoneLinha = newRow.insertCell(2);
    const mensagemLinha = newRow.insertCell(3);
    const actionCell = newRow.insertCell(4);

    nameLinha.textContent = dados.name;
    telefoneLinha.textContent = dados.telefone;
    emailLinha.textContent = dados.email;
    mensagemLinha.textContent = dados.mensagem;

    actionCell.innerHTML = `<button type="button" class="btn btn-success" data-id-contato="${id_contato}" onclick="editarContato(this)">Editar</button>`;
}

function limparTabela() {
    const tableBody = document.getElementById('table-contato').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
}

