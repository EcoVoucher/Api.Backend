const token = localStorage.getItem('authToken');

const [header, payload, signature] = token.split('.');

// Decodificar o payload
const decodedPayload = JSON.parse(atob(payload));


function calcularSoma() {
  var soma = 0;
  for (var i = 1; i <= 18; i++) {
    var selectId = "select" + i;
    var select = document.getElementById(selectId);
    var valorSelecionado = parseInt(select.value);
    soma += valorSelecionado;
  }

  var resultadoElement = document.getElementById("resultado");
  resultadoElement.textContent = "Seu total de pontos é: " + soma;
  var comparativo = "";
  if (soma <= 150) {
    comparativo = "É menor que 4 gha, equivalente à dos E.U.A.";
  } else if (soma <= 400) {
    comparativo = "Está entre 4 e 6 gha, equivalente à da França";
  } else if (soma <= 600) {
    comparativo = "Está entre 6 e 8 gha, equivalente à da Suécia";
  } else if (soma <= 800) {
    comparativo = "Está entre 8 e 10 gha, padrão Brasil";
  } else {
    comparativo = "É maior que 10 gha, dentro da média mundial";
  }



// Exibir o conteúdo do payload
console.log(JSON.stringify(decodedPayload.user.id, null, 2));

  alert("Seu total de pontos é: " + soma + "\nPegada ecológica: " + comparativo);
    fetch('/api/user/alterar_pegada', {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        'access-token': token,
        },
        body: JSON.stringify({
            token: decodedPayload.user.id,
            soma_pegada: soma
        })
    }).then((response) => response.json()).then((data) => {
        alert("Pegada ecológica atualizada com sucesso!");
    }).catch((error) => {
        alert("Erro ao atualizar pegada ecológica!");
        console.error('Erro ao atualizar pegada ecológica:', error);
    });
}

const queryString = window.location.search;


function deletar() {
    if(confirm("Deseja realmente deletar sua conta?")){
        fetch(`/api/user/${decodedPayload.user.id}`, {
            method: 'DELETE',
            headers: {  'access-token': token }
        }).then((response) => {
            localStorage.removeItem('authToken');
            alert("Conta deletada com sucesso!");
            window.location.href = `/login.html`;
        }).catch((error) => {
            alert("Erro ao deletar conta!");
            console.error('Erro ao deletar conta:', error);
        });
    } else {
        console.log(decodedPayload.user.id)
    }
}
