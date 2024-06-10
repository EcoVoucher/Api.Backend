async function carregarDados() {
    try {
        const response = await fetch('http://localhost:4000/api/user?cpf=true', {
            method: 'GET',
            headers: {
                'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY2NjVkNDFiZGU2NTg2ZDY2OGNlMGRmIn0sImlhdCI6MTcxODAzODI3MiwiZXhwIjoxNzE4MDQ4MjcyfQ.LvpfjO8gTOE_eFVvvN99tiv3SQ3KPclZGrkP6e5_wQk'
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
            alert(`Erro: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao buscar dados. Por favor, tente novamente mais tarde.');
    }
}

async function deletarUsuario(id_usuario) {
    try {
        const response = await fetch(`http://localhost:4000/api/user/${id_usuario}`, {
            method: 'DELETE',
            headers: {
                'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY2NjVkNDFiZGU2NTg2ZDY2OGNlMGRmIn0sImlhdCI6MTcxODAzODI3MiwiZXhwIjoxNzE4MDQ4MjcyfQ.LvpfjO8gTOE_eFVvvN99tiv3SQ3KPclZGrkP6e5_wQk'
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
