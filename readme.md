# NLW 14 - Trilha Node.Js - Sistema de Enquetes (Poll)

API de sistema de enquetes feito em **Node.Js** usando conceitos de requisições ***HTTP*** e ***Websockets***, em conjunto com as principais bibliotecas:
* Prisma - Para relacionamento com o banco de dados;
* Fastify - Para conceitos de requisições ***HTTP*** e uso de ***Websockets***;

<hr>

## :computer: Tecnologias Usadas
<img alt='JavaScript Logo' height='60' width='50' src='https://raw.githubusercontent.com/get-icon/geticon/fc0f660daee147afb4a56c64e12bde6486b73e39/icons/javascript.svg' />&nbsp;
<img alt='TypeScript Logo' height='60' width='50' src='https://raw.githubusercontent.com/get-icon/geticon/fc0f660daee147afb4a56c64e12bde6486b73e39/icons/typescript-icon.svg' />&nbsp;
<img alt='Node.Js Logo' height='60' width='50' src='https://raw.githubusercontent.com/get-icon/geticon/fc0f660daee147afb4a56c64e12bde6486b73e39/icons/nodejs-icon.svg' />&nbsp;
<img alt='Postgres Logo' height='60' width='50' src='https://raw.githubusercontent.com/get-icon/geticon/fc0f660daee147afb4a56c64e12bde6486b73e39/icons/postgresql.svg' />&nbsp;
<img alt='Fastify Logo' height='60' width='50' src='https://raw.githubusercontent.com/get-icon/geticon/fc0f660daee147afb4a56c64e12bde6486b73e39/icons/fastify-icon.svg' />&nbsp;
<img alt='Postman Logo' height='60' width='50' src='https://raw.githubusercontent.com/get-icon/geticon/fc0f660daee147afb4a56c64e12bde6486b73e39/icons/postman.svg' />&nbsp;
<img alt='Docker Logo' height='60' width='50' src='https://raw.githubusercontent.com/get-icon/geticon/fc0f660daee147afb4a56c64e12bde6486b73e39/icons/docker-icon.svg' />&nbsp;

## ⚙ Configurações Iniciais
1. Instale as dependências do projeto com o comando abaixo:
```bash
npm install
```

2. Construa o container com o comando:
```bash
docker compose up -d
```

3. Execute o servidor com:
```bash
npm run dev
```

> Caso você queira ver os dados armazenados através da lib do ***Prisma***, execute o comando:
> ```bash
> npx prisma studio
> ```

4. No seu **Postman**, clique no botão "Import" no canto superior esquerdo, e selecione o [arquivo JSON](./docs/#NLW14%20-%20Node.Js%20-%20Polls.postman_collection.json) com todas as rotas disponíveis para uso.

5. Para acessar a rota do **Websocket**, crie um novo arquivo no seu **Postman** do tipo **Websocket** e use o caminho:
*`ws://localhost:3333/polls/{POLL_ID}/results`*

## 💿 Como Executar

A aplicação consiste em criar **enquetes**, **opções de enquetes** e votar em alguma das opções da enquete. Cada enquete é independente da outra, ou seja, é possivel votar em uma opção de uma enquete, e votar em outra opção de outra enquete, sem que as 2 entrem em conflito.

Caso seja votado outra opção de uma enquete que já foi votada, o voto é excluido depois criado na nova opção, mantendo a independência dos votos.

As rotas para a entidade **Poll** são as seguintes:

### HTTP
* **POST**:
    * Create Poll: *http://localhost:3333/polls* - Criar uma nova enquete de votação.
        * Estrutura do body:
        ```json
        {
            "title": "Best language?",
            "options": [
                "HTML",
                "CSS",
                "JavaSCript"
            ]
        }
        ```
    * Vote on Poll: *http://localhost:3333/polls/{POLL_ID}/votes* - Votar em uma das opções de enquete de uma enquete.
        * Estrutura do body:
        ```json
        {
            "pollOptionId": "871cae5d-6f89-46b8-ad95-3921d48e1773"
        }
        ```
* **GET**:
    * Get Poll: *http://localhost:3333/polls/{POLL_ID}* - Retornar uma enquete.

### Websockets
* *ws://localhost:3333/polls/{POLL_ID}/results* - Cria uma conexão constante entre o cliente e o servidor para notificar o cliente quando o ranking de votos de uma enquete mudar.