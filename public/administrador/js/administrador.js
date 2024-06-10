document.getElementById('tipo-select').addEventListener('change', function() {
    const tipo = this.value;
    carregarDadosComplex(tipo);
});

async function carregarDados() {
    try {
        const response = await fetch('http://localhost:4000/api/contato', {
            method: 'GET',
        });

        if (response.ok) {
            const result = await response.json();
            const tbody = document.getElementById('tabela-contato-adm');
            tbody.innerHTML = "";
            for (let i = 0; i < result.length; i++) {
                tbody.innerHTML +=
                `
                    <tr>
                        <td>${result[i].name}</td>
                        <td>${result[i].email}</td>
                        <td>${result[i].tipo}</td>
                        <td>${result[i].mensagem}</td>
                        <td>${result[i].dataEnvio}</td>
                        <td><button type="button" class="btn btn-danger" onclick="deletarContato('${result[i]._id}')">Deletar</button></td>
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

async function carregarDadosComplex(tipos) {
    let url;
    if (tipos === 'all') {
        url = `http://localhost:4000/api/contato/complex-query?dateStart=2024-01-01&dateEnd=2024-12-31&tipos=1,2,3`;
    } else {
        url = `http://localhost:4000/api/contato/complex-query?dateStart=2024-01-01&dateEnd=2024-12-31&tipos=${tipos}`;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            let result = await response.json();

            // Ordena os dados por tipo e data de envio
            result = result.sort((a, b) => {
                if (a.tipo === b.tipo) {
                    return new Date(a.dataEnvio) - new Date(b.dataEnvio);
                }
                return a.tipo - b.tipo;
            });

            const tbody = document.getElementById('tabela-contato-adm');
            tbody.innerHTML = "";

            for (let i = 0; i < result.length; i++) {
                tbody.innerHTML +=
                `
                    <tr>
                        <td>${result[i].name}</td>
                        <td>${result[i].email}</td>
                        <td>${result[i].tipo}</td>
                        <td>${result[i].mensagem}</td>
                        <td>${result[i].dataEnvio}</td>
                        <td><button type="button" class="btn btn-danger" onclick="deletarContato('${result[i]._id}')">Deletar</button></td>
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

async function deletarContato(id_contato) {
    try {
        const response = await fetch(`http://localhost:4000/api/contato/${id_contato}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const result = await response.json();

            alert('Mensagem de contato deletada com sucesso!');
            carregarDados(); // Recarrega todos os dados após deletar
        } else {
            const error = await response.json();
            alert(`Erro: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro deletar mensagem:', error);
        alert('Erro deletar mensagem. Por favor, tente novamente mais tarde.');
    }
}

// Carrega todos os dados ao carregar a página
document.addEventListener('DOMContentLoaded', (event) => {
    carregarDados();
});
