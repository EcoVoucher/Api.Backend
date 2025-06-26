<p align="center">
  <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/ecovoucher%20mobile.png?raw=true" width="600px" />
</p>


# O EcoVoucher

Uma solução economicamente viável para auxiliar no combate à fome, de maneira sustentável e, em conjunto com os Objetivos do Desenvolvimento Sustentável (O.D.S), buscar gerar valor através do EcoVoucher.
O EcoVoucher irá transformar a maneira de gerar valor à população através da reciclagem. Seu funcionamento é simples como demonstrado abaixo:
O cidadão coleta o resíduo reciclável, leva até um dos pontos de coleta, pontos esses que estarão distribuídos de maneira sistemática pela cidade, deposita o resíduo no equipamento, o equipamento realiza a análise do tipo e quantidade de cada item e, após computar, classificar e pesar os itens, devolve, em forma de crédito o valor computado. Os créditos poderão ser utilizados para comprar passagens de ônibus, comprar itens básicos de cesta de alimentos ou, até mesmo, abater em tributos municipais.

> [!NOTE]
> Projeto baseado na metodologia ágil SCRUM, procurando desenvolver a Proatividade, Autonomia, Colaboração e Entrega de Resultados dos envolvidos no projeto.

## Arquitetura

<details>
   <summary>Requisitos Funcionais</summary>
    <details>
  <summary>Cadastro</summary>
  <p>
    📽️ <a href="https://github.com/EcoVoucher/Api.Backend/blob/main/RF01%20-%20Video.mp4">Clique aqui para ver o vídeo de Cadastro</a>
  </p>
</details>
</details>
<details>
   <summary>Requisitos Não Funcionais</summary>
    <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RNF-APP-EcoVoucher.png">
    </div>
</details>


## Apresentação
Confira a seguir uma demonstração das funcionalidades do site:
<details>
   <summary>Cadastro</summary>
    <div align="center">
        <img src="https://github.com/Eng-FelipeA/EcoVoucher/blob/main/Assets/Tela-de-Cadastro-Ecovoucher.gif">
    </div>
</details>
<details>
   <summary>Login</summary>
    <div align="center">
        <img src="https://github.com/Eng-FelipeA/EcoVoucher/blob/main/Assets/Tela-de-Login-EcoVoucher.gif">
    </div>
</details>

## Sprints
Cada entrega foi realizada a partir da criação de uma **tag** em cada repositório (web e todos os microsserviços), além da criação de uma branch neste repositório com um relatório completo de tudo o que foi desenvolvido naquela sprint. Observe a relação a seguir:
| Sprint | Previsão | Status | Histórico |
|:--:|:----------:|:----------------|:-------------------------------------------------:|
| 01 | 27/05/2024 | ✔️ Concluída    | [ver relatório](https://github.com/EcoVoucher/Api.Backend/blob/main/Sprint1.md) |
| 02 | 10/06/2024 |  ✔️ Concluída    | [ver relatório](https://github.com/EcoVoucher/Api.Backend/blob/main/Sprint2.md) |
| 03 | 19/06/2024 |  ✔️ Concluída   | [ver relatório](https://github.com/EcoVoucher/Api.Backend/blob/main/Sprint3.md) |
| 04 | 15/10/2024 | ✔️ Concluída    | [ver relatório](https://github.com/EcoVoucher/Api.Backend/blob/main/Sprint4.md) |
| 05 | 28/11/2024 |  ✔️ Concluída    | [ver relatório](https://github.com/EcoVoucher/Api.Backend/blob/main/Sprint5.md) |
| 06 | 02/12/2024 |  ✔️ Concluída   | [ver relatório](https://github.com/EcoVoucher/Api.Backend/blob/main/Sprint6.md) |
| 07 | 30/04/2025 |  ✔️ Concluída   | [ver relatório](https://github.com/EcoVoucher/Api.Backend/blob/main/Sprint7.md) |
| 08 | 30/05/2025 |  Em Andamento   | [ver relatório](https://github.com/EcoVoucher/Api.Backend/blob/main/Sprint8.md) |
| 09 | 26/06/2025 |  Futura   | [ver relatório](https://github.com/EcoVoucher/Api.Backend/blob/main/Sprint9.md) |

  
→ [Voltar ao topo](#topo)

## Segurança

<details>

    
## Plano de Risco - Aplicativo React Native + Node.js + MongoDB

      

Principais riscos associados ao desenvolvimento, operação e infraestrutura do aplicativo, que é hospedado na **AWS (Amazon Web Services)**.



## Infraestrutura
> O backend (Node.js) e o banco de dados (MongoDB) estão hospedados na AWS, utilizando serviços como EC2, S3, CloudWatch e MongoDB Atlas.



## Tabela de Riscos

| ID  | Categoria         | Descrição do Risco                                                         | Impacto | Probabilidade | Mitigação                                                              | Contingência                                                   | Status |
|-----|--------------------|------------------------------------------------------------------------------|---------|----------------|------------------------------------------------------------------------|----------------------------------------------------------------|--------|
| R1  | Tecnológico        | Incompatibilidade entre bibliotecas do React Native após atualizações      | Alto    | Médio          | Controle de versão, testes em ambiente separado                       | Reverter versão via Git, registrar bug                         | ⚠️ Em andamento |
| R2  | Backend/API        | Falha no servidor Node.js (crash, escalabilidade)                          | Alto    | Médio          | Logs, PM2, Elastic Beanstalk com Auto Scaling                         | Reinício automático, fallback de endpoints                     | ⚠️ Em andamento |
| R3  | Banco de Dados     | Perda ou corrupção de dados no MongoDB                                     | Alto    | Baixo          | Backups automáticos, réplica (MongoDB Atlas), validações              | Restauração de backup, failover automático                     | ⚠️ Em andamento |
| R4  | Segurança          | Vazamento de dados sensíveis de usuários                                   | Crítico | Médio          | HTTPS, JWT, validações, WAF da AWS                                    | Bloqueio, reset de tokens, plano LGPD                          | ⚠️ Em andamento |
| R5  | Conectividade      | App não funciona offline                                                    | Médio   | Alto           | Cache local (AsyncStorage, SQLite)                                     | Exibir modo offline, reconexão automática                      | ⚠️ Em andamento |
| R6  | Desempenho         | Lentidão em dispositivos de baixo desempenho                               | Médio   | Alto           | Otimização de componentes, lazy loading                                | Desativar recursos pesados, alertar o usuário                  | ⚠️ Em andamento |
| R7  | Integrações        | APIs de terceiros indisponíveis (pagamentos, mapas, etc.)                  | Alto    | Médio          | Circuit breakers, retries, fallback                                    | Mensagem amigável, reprocessamento posterior                   | ⚠️ Em andamento |
| R8  | Equipe             | Saída de desenvolvedores-chave                                             | Médio   | Médio          | Documentação técnica, onboarding contínuo                              | Redistribuição de tarefas, consultoria emergencial             | ⚠️ Em andamento |
| R9  | Deploy             | Falha na publicação nas lojas (App Store/Google Play)                      | Alto    | Médio          | CI/CD (Fastlane), checklist de publicação                              | Correções rápidas, nova submissão                              | ⚠️ Em andamento |
| R10 | Legal / LGPD       | Não conformidade com LGPD ou privacidade de dados                          | Crítico | Médio          | Consentimento, anonimização, revisão contínua da coleta                | Notificação à ANPD, correção imediata                          | ⚠️ Em andamento |
| R11 | Infraestrutura AWS | Queda de serviços da AWS (EC2, S3, etc.)                                   | Crítico | Baixo          | Alta disponibilidade, múltiplas zonas/regions, monitoramento contínuo | Failover automático, migração para outra região                | ⚠️ Em andamento |



## Ações Preventivas

- Monitoramento com **AWS CloudWatch**
- CI/CD com **GitHub Actions**
- Revisão de **segurança e LGPD** a cada release
- Documentação e **checklists de manutenção atualizados**




</details>

→ [Voltar ao topo](#topo)


# Tecnologias Utilizadas

<div align="center">
    
![Timeline](https://github.com/EcoVoucher/Api.Backend/blob/main/Timeline%20atualizada.png)
</div>



# Equipe

|    Função     | Nome                                  |                                                                                                                                                      LinkedIn & GitHub                                                                                                                                                      |
| :-----------: | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   Scrum Master    | Felipe Afonso da Silva Vieira                 |   [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/felipe-afonso-da-silva-vieira-b32860105/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/Eng-FelipeA)   |
|   Developer    | João Pedro               |         [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/joao-pedro01) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/joao-pedro01)        |
|   Developer    | Letícia Pinheiro                   |         [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/leticia-pinheiro-946733308) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/Leticiapinheiro1   )        |
|   Product Owner    | Marcus Vinicyus Souza Barros                 |   [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/marcus-barros-055a9a8b/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/marcusvsbarros)   |
| Product Owner  | Publio Moreira Gomes Ferreira |      [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/publio-gomes-488b2a27/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/publiogomes)     |
