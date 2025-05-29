# TaskFlow

Esta é uma API REST desenvolvida utilizando NestJS e Prisma ORM para gerenciamento eficiente do banco de dados. A arquitetura do projeto é modular, adotando injeção de dependências para manter o código organizado e escalável.


### Principais características

- Uso de DTOs (Data Transfer Objects) para definição clara da estrutura das requisições e respostas, garantindo a integridade dos dados.

- Tratamento de erros personalizado por meio de filtros, proporcionando respostas controladas e consistentes.

- Testes automatizados com Jest, garantindo maior confiabilidade e qualidade do código.

- Documentação automática da API gerada com Swagger, facilitando a integração e o entendimento dos endpoints.

- Desenvolvido em TypeScript, com foco em tipagem forte e segurança.


### Tecnologias utilizadas

- NestJS

- Prisma ORM

- Swagger

- Jest

- TypeScript


## Funcionalidades

- CRUD completo para entidades do sistema

- Validação de dados com DTOs

- Tratamento centralizado de erros

- Testes unitários e integração

- Documentação interativa dos endpoints


## Como rodar o projeto

1. Clone o repositório

```
git clone https://github.com/Joao-VictorCm/SEU-REPO.git
```

2. Instale as dependências

```
npm install
```

3. Configure o banco de dados e variáveis de ambiente (arquivo .env)

4. Execute as migrations do Prisma
```
npx prisma migrate dev
```

5. Inicie a aplicação

```
npm run start:dev
```

6. Acesse a documentação Swagger em: http://localhost:3000/api


## Testes
1. Execute os testes com:

Testes
Execute os testes com:

```
npm run test
