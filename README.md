<p align="center">
  <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/ecovoucher%20mobile.png?raw=true" width="600px" />
</p>


# O EcoVoucher

Uma solução economicamente viável para auxiliar no combate à fome, de maneira sustentável e, em conjunto com os Objetivos do Desenvolvimento Sustentável (O.D.S), buscar gerar valor através do EcoVoucher.
O EcoVoucher irá transformar a maneira de gerar valor à população através da reciclagem. Seu funcionamento é simples, o cidadão coleta o resíduo reciclável, leva até um dos pontos de coleta, pontos esses que estarão distribuídos de maneira sistemática pela cidade, ou seja, próximo de locais que a população mais necessitada pode acessar com maior facilidade, deposita o resíduo no equipamento, o equipamento realiza a análise do tipo e quantidade de cada item e, após computar, classificar e pesar os itens, devolve, em forma de crédito o valor computado. Os créditos EcoVoucher poderão ser utilizados para comprar passagens de ônibus, comprar itens básicos de cesta de alimentos ou, até mesmo, abater em tributos municipais.
Para auxiliar a polpulação, foi desenvolvido um app gratuito, onde o cidadão poderá consultar seus pontos, gerar vouchers, consultar vouchers disponíveis, verificar pontos de coleta e troca, entre outras utilidades. 

> [!NOTE]
> Projeto baseado na metodologia ágil SCRUM, procurando desenvolver a Proatividade, Autonomia, Colaboração e Entrega de Resultados dos envolvidos no projeto.

## Arquitetura

<details>
   <summary>Diagrama AWS</summary>
    <summary>A estrutura do projeto está hospedada na AWS, sob um domínio DNS configurado para direcionamento das aplicações. O backend está distribuído em duas instâncias EC2 separadas: uma dedicada à API e outra isolada para o banco de dados MongoDB, garantindo maior segurança e controle de acesso. Um bucket S3 foi provisionado para armazenamento de arquivos, com uso eventual e preparado para replicação futura. O controle de permissões é gerenciado por IAM Roles aplicadas tanto na instância da API quanto no S3, garantindo acesso seguro e restrito. Toda a infraestrutura é monitorada continuamente por meio do Amazon CloudWatch, proporcionando visibilidade em tempo real e alertas de desempenho e disponibilidade.</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/Diagrama%20AWS.png">
        </div>
</details>
<details>
   <summary>Requisitos Funcionais</summary>
    <details>
      <summary>RF001 - O APP deve permitir cadastro de usuário de dados mínimos (nome completo, cpf, email...) </summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF01%20-%20Video.gif">
        </div>
    </details>
    <details>
      <summary>RF002 - O APP deve permitir que o usuário faça login</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF02.gif">
        </div>
    </details>
    <details>
      <summary>RF003 - O APP deve permitir a visualização e alteração do perfil do usuário</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF04.gif">
        </div>
    </details>
    <details>
      <summary>RF004 - O APP deve exibir o saldo atual de créditos do usuário</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF05.gif">
        </div>
    </details>
    <details>
      <summary>RF005 - O APP deve permitir que o usuário localize pontos de coletas mais próximo</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF06.gif">
        </div>
    </details>
    <details>
      <summary>RF006 - O APP deve exibir informações de cada ponto de coleta</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF06.gif">
        </div>
    </details>
    <details>
      <summary>RF007 - O APP deve exibir o histórico de resíduos entregues com os dados relativos</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF08.jpg" alt="RF08" width="300"/>
        </div>
    </details>
    <details>
      <summary>RF008 - O APP deve permitir ao usuário acompanhar o acúmulo de créditos</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF08.jpg" alt="RF08" width="300">
        </div>
    </details>
    <details>
      <summary>RF009 - O APP deve permitir que o usuário acesse as opções de uso dos créditos</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF10.gif">
        </div>
    </details>
    <details>
      <summary>RF010 - O APP deve gerar um comprovante digital</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF10.gif">
        </div>
    </details>
    <details>
      <summary>RF011 - O APP deve possuir interface simples, intuitiva e acessível.</summary>
        <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF16.gif">
        </div>
    </details>
</details>

<details>
<summary>Requisitos Não Funcionais</summary>
<div>
<table border="1">
  <thead>
    <tr>
      <th>NÚMERO DO REQUISITO</th>
      <th>NOME</th>
      <th>DESCRIÇÃO</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>RNF001</td>
      <td>Desenvolvimento</td>
      <td>Desenvolver o app em HTML, JavaScript, TypeScript, CSS utilizando o framework React-Native</td>
    </tr>
    <tr>
      <td>RNF002</td>
      <td>Tempo de resposta aceitável</td>
      <td>O app deve responder às interações do usuário (como abrir uma tela ou executar uma consulta no SQLite)</td>
    </tr>
    <tr>
      <td>RNF003</td>
      <td>Execução assíncrona de queries</td>
      <td>Uso de APIs assíncronas para evitar bloqueio da UI.</td>
    </tr>
    <tr>
      <td>RNF004</td>
      <td>Gestão de memória eficiente</td>
      <td>O app deve evitar vazamentos de memória relacionados a conexões persistentes com o banco SQLite.</td>
    </tr>
    <tr>
      <td>RNF005</td>
      <td>Criptografia de dados sensíveis</td>
      <td>Caso dados pessoais ou sensíveis sejam armazenados, o SQLite deve ser utilizado com alguma camada de criptografia.</td>
    </tr>
    <tr>
      <td>RNF006</td>
      <td>Proteção contra injeção de SQL</td>
      <td>Uso de queries parametrizadas ou prepared statements.</td>
    </tr>
    <tr>
      <td>RNF007</td>
      <td>Armazenamento local seguro</td>
      <td>Proteção do arquivo do banco de dados com permissões restritas no sistema de arquivos do dispositivo.</td>
    </tr>
    <tr>
      <td>RNF008</td>
      <td>Feedback ao usuário</td>
      <td>O app deve informar visualmente o usuário quando estiver acessando ou manipulando dados (ex: spinners durante carregamento).</td>
    </tr>
    <tr>
      <td>RNF009</td>
      <td>Compatibilidade com modo off-line</td>
      <td>Como SQLite é local, o app deve funcionar completamente off-line para as funcionalidades que não dependem da internet.</td>
    </tr>
    <tr>
      <td>RNF010</td>
      <td>Compatibilidade com Android e iOS</td>
      <td>O app deve funcionar corretamente nos dois sistemas operacionais, utilizando bibliotecas como react-native-sqlite-storage ou react-native-sqlite-2 que suportem ambos.</td>
    </tr>
    <tr>
      <td>RNF011</td>
      <td>Independência da arquitetura do dispositivo</td>
      <td>O banco não deve depender de features específicas de hardware ou arquitetura.</td>
    </tr>
    <tr>
      <td>RNF012</td>
      <td>Estrutura clara do schema de banco</td>
      <td>Scripts de criação do banco bem organizados e versionados. Migrações controladas: Implementação de controle de versões para o banco de dados com suporte a migrações.</td>
    </tr>
    <tr>
      <td>RNF013</td>
      <td>Logs e tratamento de erros adequados</td>
      <td>O app deve registrar falhas em operações de banco para facilitar a correção de bugs.</td>
    </tr>
    <tr>
      <td>RNF014</td>
      <td>Gerenciamento de grande volume de dados</td>
      <td>O app deve ser capaz de lidar com crescimento progressivo dos dados locais (indexação, paginamento, etc.).</td>
    </tr>
    <tr>
      <td>RNF015</td>
      <td>Boa estrutura de índices</td>
      <td>Queries otimizadas com uso de índices para melhorar desempenho conforme os dados crescem.</td>
    </tr>
  </tbody>
</table>

</div>
</details>

## Apresentação
<details>
   <summary>Visão gerais do APP</summary>
    <sumary>• Desenvolvimento de aplicativo mobile em React Native, com arquitetura baseada em componentes reutilizáveis, integração a banco de dados MongoDB hospedado na AWS, aplicando boas práticas de segurança da informação, incluindo controle de acesso, criptografia de dados sensíveis e autenticação segura.</sumary>
    <div align="center">
        <img src="https://github.com/EcoVoucher/Api.Backend/blob/main/RF10.gif">
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
