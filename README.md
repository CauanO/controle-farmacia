# Controle de Estoque de Farmácia

## Sobre o Projeto

Este é um sistema de controle de estoque de farmácia, desenvolvido com **Node.js**, **Express** e **MongoDB**. Ele permite gerenciar produtos, usuários e outros aspectos do estoque de uma farmácia de forma simples e eficiente.

---

## Funcionalidades

- Cadastro e gerenciamento de usuários.
- Cadastro de produtos no estoque.
- Autenticação de usuários com **Passport.js**.
- Flash messages para feedback ao usuário.
- Gerenciamento de sessões com **express-session**.

---

## Tecnologias Utilizadas

- **Node.js**: Plataforma de desenvolvimento backend.
- **Express.js**: Framework web para Node.js.
- **MongoDB**: Banco de dados NoSQL.
- **Handlebars**: Template engine para renderização de páginas HTML.
- **Passport.js**: Biblioteca para autenticação.

---

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd controle-farmacia
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure o banco de dados**:
   - Certifique-se de que o MongoDB está em execução.
   - Atualize a URL de conexão ao MongoDB no arquivo `app.js`:
     ```javascript
     mongoose.connect("mongodb://localhost/controleFarmacia");
     ```

4. **Inicie o servidor**:
   ```bash
   node app.js
   ```

5. Acesse o sistema em [http://localhost:8081](http://localhost:8081).

---

## Dependências

As dependências do projeto estão listadas no arquivo `package.json`:

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.2",
    "connect-flash": "^0.1.1",
    "express": "^4.19.2",
    "express-handlebars": "^7.1.2",
    "express-session": "^1.18.0",
    "mongoose": "^8.4.1",
    "multer": "^1.4.5-lts.1",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0"
  }
}
```

---

## Estrutura do Projeto

- **`app.js`**: Arquivo principal que inicializa o servidor e as rotas.
- **`routes/`**: Contém as rotas para administração e usuários.
- **`views/`**: Páginas HTML renderizadas com Handlebars.
- **`models/`**: Modelos de dados para o MongoDB.

---

## Status do Projeto

[![Projeto Completo](https://img.shields.io/badge/Projeto-Completo-brightgreen)](#) [![Projeto Incompleto](https://img.shields.io/badge/Projeto-Incompleto-red)](#)

---

## Licença

Este projeto está sob a licença **MIT**. Sinta-se à vontade para usá-lo, modificá-lo e distribuí-lo.
