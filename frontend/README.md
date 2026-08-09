# Desapega Campus

Marketplace universitário de economia circular desenvolvido para o **Processo Seletivo Vortex 2026.2**.

A proposta do **Desapega Campus** é facilitar a compra, venda e doação de materiais entre estudantes, como livros, calculadoras, componentes eletrônicos, jalecos e outros itens utilizados no ambiente acadêmico.

A aplicação foi desenvolvida como uma solução **full-stack**, composta por uma API REST em FastAPI e um frontend responsivo em React, com suporte a PWA.

---

## Aplicação em produção

- **Frontend:** https://vortex-marketplace-oj7l.onrender.com
- **Backend / API:** https://desapega-campos-api.onrender.com
- **Swagger / OpenAPI:** https://desapega-campos-api.onrender.com/docs

### Usuário de demonstração

- **E-mail:** `demo@desapegacampus.com`
- **Senha:** `demo1234`

---

## Funcionalidades

- Landing page pública com apresentação do projeto.
- Listagem pública de anúncios.
- Busca por título e descrição.
- Filtros por categoria.
- Estatísticas da plataforma.
- Cadastro de usuários.
- Autenticação com JWT.
- Persistência de sessão no frontend.
- Rotas protegidas.
- Criação de anúncios.
- Visualização dos próprios anúncios.
- Edição de anúncios.
- Exclusão de anúncios.
- Diferenciação entre venda e doação.
- Validação de propriedade dos anúncios.
- Interface responsiva para desktop e mobile.
- Menu de navegação mobile.
- PWA instalável.
- Service Worker com cache de assets.
- Seed de dados para demonstração.
- Testes automatizados no backend.

---

## Tecnologias

### Backend

- Python 3.11
- FastAPI
- SQLAlchemy
- Pydantic
- Pydantic Settings
- PostgreSQL
- SQLite para desenvolvimento local
- Psycopg
- JWT com `python-jose`
- Argon2id com `pwdlib`
- Pytest
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Lucide React
- `vite-plugin-pwa`
- Workbox
- CSS responsivo

### Infraestrutura

- Render Static Site — frontend
- Render Web Service — backend
- Render PostgreSQL — banco de produção

---

## Arquitetura

O projeto utiliza uma estrutura monorepo:

```text
vortex-marketplace/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── main.py
│   │   └── seed.py
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

O frontend consome a API REST por meio do Axios.

### Ambiente de desenvolvimento

```text
React / Vite
    ↓
FastAPI
    ↓
SQLite
```

### Ambiente de produção

```text
React / Render Static Site
        ↓ HTTPS
FastAPI / Render Web Service
        ↓
PostgreSQL / Render
```

---

# Como executar localmente

## Pré-requisitos

- Python 3.11+
- Node.js 20+
- npm
- Git

---

## Backend

Entre no diretório do backend:

```bash
cd backend
```

Crie um ambiente virtual:

```bash
python3 -m venv .venv
```

Ative o ambiente no macOS/Linux:

```bash
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie o arquivo `.env` com base no `.env_example`.

Exemplo:

```env
DATABASE_URL=sqlite:///./vortex.db
SECRET_KEY=sua_chave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

Execute a API:

```bash
uvicorn app.main:app --reload
```

A API estará disponível em:

```text
http://127.0.0.1:8000
```

A documentação Swagger estará disponível em:

```text
http://127.0.0.1:8000/docs
```

---

## Seed de demonstração

Para popular o banco local com dados de exemplo:

```bash
python3 -m app.seed
```

O seed cria um usuário de demonstração e anúncios iniciais.

Antes de inserir os dados, a rotina verifica se o usuário demo já existe, evitando a duplicação dos registros caso o comando seja executado novamente.

---

## Testes do backend

Execute:

```bash
pytest -v
```

A suíte de testes cobre fluxos de autenticação e gerenciamento de anúncios.

---

## Frontend

Em outro terminal, entre no diretório:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em:

```text
http://localhost:5173
```

Para gerar o build de produção:

```bash
npm run build
```

Para testar localmente o build de produção:

```bash
npm run preview
```

---

# API

## Autenticação

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

## Anúncios

```text
POST   /ads
GET    /ads
GET    /ads/me
GET    /ads/{ad_id}
PATCH  /ads/{ad_id}
DELETE /ads/{ad_id}
```

## Estatísticas

```text
GET /stats
```

## Saúde da API

```text
GET /health
```

A documentação completa das rotas, schemas e payloads está disponível no Swagger.

---

# Autenticação e segurança

As senhas dos usuários não são armazenadas em texto puro.

O backend utiliza **Argon2id** para geração e verificação dos hashes das senhas.

Após o login, a API gera um **JWT**. O frontend armazena o token e o envia automaticamente no header das requisições autenticadas:

```text
Authorization: Bearer <token>
```

As operações de edição e exclusão também verificam se o usuário autenticado é proprietário do anúncio antes de permitir a alteração.

---

# PWA

O frontend foi configurado como **Progressive Web App** utilizando `vite-plugin-pwa`.

Foram configurados:

- Web App Manifest;
- Service Worker;
- ícones da aplicação;
- modo `standalone`;
- cache de assets;
- cache de imagens externas;
- suporte à instalação da aplicação.

O Service Worker é gerado durante o build de produção pelo Workbox.

---

# Diário de Bordo da Inteligência Artificial

## Ferramenta utilizada

Durante o desenvolvimento utilizei principalmente o **ChatGPT** como ferramenta de apoio.

A IA foi utilizada para:

- discutir arquitetura e organização do projeto;
- revisar decisões técnicas;
- auxiliar na identificação de bugs;
- estruturar componentes do frontend;
- sugerir estratégias de responsividade;
- configurar PWA e Service Worker;
- auxiliar na preparação do deploy;
- analisar mensagens de erro e logs.

A implementação foi validada durante todo o desenvolvimento por meio do Swagger, testes automatizados, inspeção com DevTools e testes manuais dos fluxos do frontend.

---

## Reflexão crítica sobre o uso da IA

Um dos pontos mais importantes durante o desenvolvimento foi perceber que uma resposta da IA não deveria ser assumida como correta apenas por parecer tecnicamente plausível.

### Dependências no deploy do backend

Durante a preparação do projeto para produção, o `requirements.txt` havia sido gerado anteriormente com:

```bash
pip freeze
```

Isso acabou incluindo diversas dependências que não faziam parte da API.

Quando o backend foi enviado ao Render, o build falhou tentando instalar dependências como `onnxruntime`.

A partir do log de produção foi possível identificar que o problema não estava no FastAPI ou no PostgreSQL, mas no ambiente de dependências.

A solução foi revisar as bibliotecas realmente utilizadas pelo projeto e criar um `requirements.txt` mínimo e coerente com a aplicação.

### Cards ocultados por bloqueador de anúncios

Outro caso ocorreu no frontend em produção.

Os anúncios estavam sendo recebidos corretamente pela API e as categorias apareciam na interface, porém os cards não eram exibidos.

A inspeção do DOM mostrou:

```html
<article class="ad-card" style="display: none !important;">
```

O código da aplicação nunca adicionava esse estilo.

A investigação mostrou que o bloqueador de anúncios do navegador interpretava a classe `ad-card` como publicidade e escondia os componentes.

A solução foi substituir a nomenclatura por:

```text
listing-card
```

eliminando a interferência do bloqueador.

Esses casos reforçaram a importância de utilizar IA como ferramenta de investigação e apoio, mas sempre validar as sugestões com logs, DevTools, testes e análise do comportamento real da aplicação.

### Auxílios extras

Como comentado anteriormente, utilizei IA como apoio em alguns pontos específicos do desenvolvimento:

#### Discutir arquitetura e organização do projeto

Neste ponto, a IA funcionou como uma espécie de “segunda voz” para discutir a modularização do projeto, avaliar abordagens e questionar se determinadas estratégias faziam sentido.

#### Revisar decisões técnicas

Como o projeto foi desenvolvido individualmente, utilizei a IA ocasionalmente para questionar decisões já tomadas, entender se havia pontos de melhoria e simular, em certa medida, a troca de ideias que existiria em uma pequena equipe.

#### Auxiliar na identificação de bugs

Em alguns momentos eu demorava em um processo de debugging ou ficava preso a uma hipótese incorreta. A IA foi utilizada como apoio para revisar logs, código e possíveis causas, enquanto a validação final era feita manualmente.

#### Sugerir estratégias de responsividade

Durante o desenvolvimento visual do frontend, utilizei IA para auxiliar na adaptação do layout para diferentes tamanhos de tela, buscando preservar a identidade visual também no mobile.

#### Configurar PWA e Service Worker

Eu ainda não havia realizado esse tipo de configuração anteriormente. Por isso, utilizei IA para compreender melhor conceitos como Web App Manifest, Service Worker, cache e instalação de uma PWA antes de aplicá-los ao projeto.

#### Auxiliar na preparação do deploy

Já havia utilizado o Render alguns anos atrás, mas a plataforma mudou desde então. A IA foi utilizada como apoio para revisar a configuração do frontend, backend, PostgreSQL e variáveis de ambiente.

#### Analisar mensagens de erro e logs

Além de erros lógicos durante o desenvolvimento local, também encontrei problemas específicos de produção, como a adaptação das dependências para PostgreSQL com `psycopg` e o deploy no Render.

Também utilizei IA como apoio na construção de uma interface visualmente mais agradável, principalmente por desenvolvimento frontend e design não serem meus principais pontos de especialização.

Em alguns momentos, tive auxilio da mesma para modular um front-end mais agradável visualmente.
Fora ao embelezamento do front-end, bug-fixes que utilizei-a para debugar quando não de forma rápida encontrei o problema, e para finalizar
também utilize-a como pequeno auxilio no render, pois havia um bom tempo que utilzei a plataforma, e ela alterou-se bastante de uns anos para o momento presente.



---

# Decisões técnicas

## SQLite no desenvolvimento e PostgreSQL em produção

SQLite foi utilizado durante o desenvolvimento por reduzir a complexidade inicial e permitir testes rápidos.

A configuração da aplicação utiliza a variável:

```text
DATABASE_URL
```

Isso permite trocar o banco utilizado sem alterar as rotas ou a lógica principal da aplicação.

No ambiente publicado, o backend utiliza PostgreSQL hospedado no Render.

---

## PATCH para atualização

A atualização de anúncios utiliza `PATCH`, pois a operação representa alteração de um recurso existente e o backend permite atualizações parciais.

---

## JWT

JWT foi utilizado para manter a API stateless e permitir autenticação entre frontend e backend implantados separadamente.

---

## Seed de demonstração

Foi criada uma rotina de seed para permitir que a banca encontre a aplicação preenchida com dados de demonstração sem precisar cadastrar todos os itens manualmente.

O seed também evita a inserção duplicada dos dados ao verificar previamente a existência do usuário de demonstração.

---

# Considerações finais

O objetivo do projeto foi ir além de apenas implementar um CRUD.

A solução buscou simular um pequeno produto real, contendo autenticação, autorização, validação, testes, experiência mobile, PWA, banco PostgreSQL e ambientes públicos de frontend e backend.

Durante o desenvolvimento, o foco principal foi compreender e validar cada integração, utilizando IA como apoio para acelerar pesquisa, debugging e organização, sem substituir a análise técnica das soluções implementadas.