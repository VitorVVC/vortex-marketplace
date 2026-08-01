### Decisão arquitetural: SQLite local e PostgreSQL em produção

Durante o início do projeto, optei por utilizar SQLite para reduzir o tempo de configuração
e validar rapidamente os modelos da aplicação. A arquitetura foi preparada para receber a
URL do banco por variável de ambiente, permitindo utilizar PostgreSQL no ambiente de
produção sem alterar a lógica da aplicação.

Decisão essa buscou equilibrar velocidade de desenvolvimento, simplicidade local e uma
infraestrutura mais adequada para o deploy.