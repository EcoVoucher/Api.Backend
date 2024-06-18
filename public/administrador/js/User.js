const token = localStorage.getItem('authToken');

const [header, payload, signature] = token.split('.');

// Decodificar o payload
const decodedPayload = JSON.parse(atob(payload));

async function carregarDados() {
    try {
        const response = await fetch('http://localhost:3000/api/user?cpf=true', {
            method: 'GET',
            headers: {
                'access-token': token
            }
        });

        if (response.ok) {
            const result = await response.json();

            const tbody = document.getElementById('tabela-user-adm');
            tbody.innerHTML = "";
            for (let i = 0; i < result.length; i++) {
                tbody.innerHTML +=
                `
                    <tr>
                        <td>${result[i].nome}</td>
                        <td>${result[i].cpf}</td>
                        <td>${result[i].email}</td>
                        <td>${result[i].dataNascimento}</td>
                        <td>${result[i].telefone}</td>
                        <td>${result[i].endereco.cep}</td>
                        <td><button type="button" class="btn btn-danger" onclick="deletarUsuario('${result[i]._id}')">Deletar</button></td>
                    </tr>
                `;
            }
        } else {
            const error = await response.json();
            alert(`Erro: ${error.error}`);
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente mais tarde.');
    }
}

async function deletarUsuario(id_usuario) {
    try {
        const response = await fetch(`http://localhost:3000/api/user/${id_usuario}`, {
            method: 'DELETE',
            headers: {
                'access-token': decodedPayload.user.id
            }
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            alert('Usuário deletado com sucesso!');
            carregarDados(); // Recarrega todos os dados após deletar
        } else {
            const error = await response.json();
            alert(`Erro: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro deletar Usuário:', error);
        alert('Erro deletar Usuário. Por favor, tente novamente mais tarde.');
    }
}

// Carrega todos os dados ao carregar a página
document.addEventListener('DOMContentLoaded', (event) => {
    carregarDados();
});
