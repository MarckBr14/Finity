# 🚀 Finity API

API desenvolvida em **C# (.NET)** para gerenciamento de assinaturas e controle financeiro.

## 📌 Sobre o Projeto

A Finity API é responsável por toda a lógica de negócio do sistema, incluindo autenticação de usuários, gerenciamento de assinaturas e análise de gastos.

## 🛠️ Tecnologias Utilizadas

* JS
* CSS
* HTML
* C#
* .NET Web API
* MySQL
* Entity Framework (opcional)
* JWT (Autenticação)

## 📁 Estrutura do Projeto

```
/Controllers
/Models
/DTOs
/Services
/Repositories
/Data
/Config
```

## 🔐 Funcionalidades

* Cadastro de usuário
* Login com autenticação JWT
* CRUD de assinaturas
* Controle financeiro
* Dashboard com dados consolidados

## ⚙️ Como Executar o Projeto

1. Clone o repositório:

```
git clone https://github.com/seu-usuario/finity-api.git](https://github.com/ReinaldoBarbosa/Finity-Web-Api-.git
```

2. Acesse a pasta do projeto:

```
cd finity-api
```

3. Configure o banco de dados no `appsettings.json`:

```
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=finity;User=root;Password=sua_senha;"
}
```

4. Execute a aplicação:

```
dotnet run
```

## 📡 Endpoints Principais

### 🔐 Autenticação

* `POST /login`
* `POST /register`

### 📦 Assinaturas

* `GET /subscriptions`
* `POST /subscriptions`
* `PUT /subscriptions/{id}`
* `DELETE /subscriptions/{id}`

### 📊 Dashboard

* `GET /dashboard`

## 🧪 Testes

Utilize ferramentas como:

* Postman
* Insomnia

## 👥 Equipe

Projeto desenvolvido por:

* Marcos Antonio
* Equipe Finity

## 📄 Licença

Este projeto é acadêmico e sem
