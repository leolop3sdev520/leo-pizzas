# Endpoints da API

Referência baseada nas rotas registradas em `src/routes.ts`.

- Base local padrão: `http://localhost:3333` (variável `PORT` pode alterar a porta).
- Não há prefixo `/api`.
- JSON: envie `Content-Type: application/json` nos endpoints com body JSON.
- Rotas protegidas: envie `Authorization: Bearer <token>` obtido em `POST /session`.
- Os exemplos usam IDs fictícios; substitua-os por UUIDs existentes.
- Erros de validação têm status `400` e formato `{"error":"Erro de Validação","details":[...]}`. Exceções lançadas por services também são convertidas em `400` pelo middleware global.

## Resumo

| Método | Endpoint | Acesso |
| --- | --- | --- |
| POST | `/users` | Público |
| POST | `/session` | Público |
| GET | `/me` | Autenticado |
| POST | `/category` | Autenticado, ADMIN |
| GET | `/category` | Autenticado |
| GET | `/category/product` | Autenticado |
| POST | `/product` | Autenticado, ADMIN |
| GET | `/products` | Autenticado |
| DELETE | `/product` | Autenticado, ADMIN |
| POST | `/order` | Autenticado |
| GET | `/orders` | Autenticado |
| POST | `/order/add` | Autenticado |
| DELETE | `/order/remove` | Autenticado |
| GET | `/order/detail` | Autenticado |
| PUT | `/order/send` | Autenticado |
| PUT | `/order/finish` | Autenticado |
| DELETE | `/order` | Autenticado |

## Usuários e sessão

### `POST /users`

Cria usuário. O papel não pode ser definido pela requisição; o banco atribui `STAFF`.

Body JSON:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `name` | string | Sim | Mínimo de 3 caracteres |
| `email` | string | Sim | E-mail válido e ainda não cadastrado |
| `password` | string | Sim | Mínimo de 6 caracteres |

Exemplo:

```http
POST /users
Content-Type: application/json

{
  "name": "Ana Souza",
  "email": "ana@example.com",
  "password": "senha123"
}
```

Resposta `200`:

```json
{
  "id": "8f18e83b-712f-4c86-a0f1-70aa8014e89a",
  "name": "Ana Souza",
  "email": "ana@example.com",
  "role": "STAFF",
  "createdAt": "2026-10-19T12:00:00.000Z"
}
```

### `POST /session`

Autentica credenciais e cria JWT com validade de 30 dias.

Body JSON:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `email` | string | Sim | E-mail válido |
| `password` | string | Sim | Texto não vazio |

Exemplo:

```http
POST /session
Content-Type: application/json

{
  "email": "ana@example.com",
  "password": "senha123"
}
```

Resposta `200`:

```json
{
  "id": "8f18e83b-712f-4c86-a0f1-70aa8014e89a",
  "name": "Ana Souza",
  "email": "ana@example.com",
  "role": "STAFF",
  "token": "<jwt>"
}
```

Credenciais incorretas retornam erro de aplicação `400` com a mensagem `Ops! E-mail ou senha inválidos. Tente novamente.`.

### `GET /me`

Retorna os dados do usuário identificado pelo JWT.

Headers: `Authorization: Bearer <token>`.

Resposta `200`:

```json
{
  "id": "8f18e83b-712f-4c86-a0f1-70aa8014e89a",
  "name": "Ana Souza",
  "email": "ana@example.com",
  "role": "STAFF",
  "createdAt": "2026-10-19T12:00:00.000Z"
}
```

## Categorias

### `POST /category`

Cria categoria. Requer JWT de usuário `ADMIN`.

Body JSON:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `name` | string | Sim | Mínimo de 2 caracteres |

Exemplo:

```http
POST /category
Authorization: Bearer <token-admin>
Content-Type: application/json

{ "name": "Pizzas tradicionais" }
```

Resposta `201`:

```json
{
  "id": "a93d2145-b14b-4888-a1ad-c0d8f49f9469",
  "name": "Pizzas tradicionais",
  "createdAt": "2026-10-19T12:00:00.000Z"
}
```

### `GET /category`

Lista categorias em ordem de criação decrescente. Requer autenticação.

Exemplo: `GET /category`

Resposta `200`:

```json
[
  {
    "id": "a93d2145-b14b-4888-a1ad-c0d8f49f9469",
    "name": "Pizzas tradicionais",
    "createdAt": "2026-10-19T12:00:00.000Z"
  }
]
```

### `GET /category/product`

Lista produtos ativos de uma categoria. Requer autenticação.

Query:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `category_id` | string | Sim | ID da categoria existente |

Exemplo: `GET /category/product?category_id=a93d2145-b14b-4888-a1ad-c0d8f49f9469`

Resposta `200`:

```json
[
  {
    "id": "e947eac5-47f1-42a7-84d5-80aacb5f9c8a",
    "name": "Margherita",
    "price": 3590,
    "description": "Molho, queijo e manjericão",
    "banner": "https://res.cloudinary.com/demo/image/upload/pizza.jpg",
    "disabled": false,
    "category_id": "a93d2145-b14b-4888-a1ad-c0d8f49f9469",
    "createdAt": "2026-10-19T12:00:00.000Z",
    "category": {
      "id": "a93d2145-b14b-4888-a1ad-c0d8f49f9469",
      "name": "Pizzas tradicionais"
    }
  }
]
```

Categoria inexistente gera erro de aplicação `400`.

## Produtos

### `POST /product`

Cria produto e envia uma imagem ao Cloudinary. Requer JWT de usuário `ADMIN`. O body é `multipart/form-data`.

| Campo | Tipo multipart | Obrigatório | Observação |
| --- | --- | --- | --- |
| `name` | texto | Sim | Nome do produto |
| `price` | texto | Sim | Converterá com `Number()`; informar o valor inteiro em centavos, por exemplo `3590` para R$ 35,90 |
| `description` | texto | Sim | Descrição |
| `category_id` | texto | Sim | ID de categoria existente |
| `file` | arquivo | Sim | JPEG/JPG/PNG, máximo 4 MiB |

Exemplo conceitual (multipart):

```text
POST /product
Authorization: Bearer <token-admin>
Content-Type: multipart/form-data

name=Margherita
price=3590
description=Molho, queijo e manjericão
category_id=a93d2145-b14b-4888-a1ad-c0d8f49f9469
file=@margherita.jpg
```

Resposta `201`:

```json
{
  "id": "e947eac5-47f1-42a7-84d5-80aacb5f9c8a",
  "name": "Margherita",
  "price": 3590,
  "description": "Molho, queijo e manjericão",
  "category_id": "a93d2145-b14b-4888-a1ad-c0d8f49f9469",
  "banner": "https://res.cloudinary.com/demo/image/upload/pizza.jpg",
  "createdAt": "2026-10-19T12:00:00.000Z"
}
```

Observação: a rota não chama `validateSchema(createProductSchema)`. A obrigatoriedade do arquivo é conferida no controller e o tipo/tamanho do arquivo é controlado pelo Multer; as demais propriedades não têm validação Zod aplicada nesta rota.

### `GET /products`

Lista produtos filtrados por `disabled`, mais recentes primeiro, incluindo dados básicos da categoria. Requer autenticação.

Query:

| Propriedade | Tipo | Obrigatória | Valores |
| --- | --- | --- | --- |
| `disabled` | string | Não | `true` ou `false`; default `false` |

Exemplos: `GET /products` lista ativos; `GET /products?disabled=true` lista desativados.

Resposta `200` (cada produto):

```json
[
  {
    "id": "e947eac5-47f1-42a7-84d5-80aacb5f9c8a",
    "name": "Margherita",
    "price": 3590,
    "description": "Molho, queijo e manjericão",
    "banner": "https://res.cloudinary.com/demo/image/upload/pizza.jpg",
    "disabled": false,
    "category_id": "a93d2145-b14b-4888-a1ad-c0d8f49f9469",
    "createdAt": "2026-10-19T12:00:00.000Z",
    "category": {
      "id": "a93d2145-b14b-4888-a1ad-c0d8f49f9469",
      "name": "Pizzas tradicionais"
    }
  }
]
```

### `DELETE /product`

Desativa logicamente o produto (`disabled: true`); não apaga o registro. Requer JWT de usuário `ADMIN`.

Query:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `product_id` | string | Sim | ID do produto |

Exemplo: `DELETE /product?product_id=e947eac5-47f1-42a7-84d5-80aacb5f9c8a`

Resposta `200`:

```json
{ "message": "Produto deletado/desabilitado com sucesso" }
```

## Pedidos

### `POST /order`

Cria pedido em rascunho. Requer autenticação.

Body JSON:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `table` | number inteiro | Sim | Maior que zero |
| `name` | string | Não | Nome associado ao pedido |

Exemplo:

```http
POST /order
Authorization: Bearer <token>
Content-Type: application/json

{ "table": 7, "name": "Ana" }
```

Resposta `201`:

```json
{
  "id": "c246ba8f-4075-4870-b8b4-61080b51fdf6",
  "table": 7,
  "name": "Ana",
  "status": false,
  "draft": true,
  "createdAt": "2026-10-19T12:00:00.000Z"
}
```

### `GET /orders`

Lista pedidos e seus itens com informações resumidas de produto. Requer autenticação.

Query:

| Propriedade | Tipo | Obrigatória | Comportamento |
| --- | --- | --- | --- |
| `draft` | string | Não | Só o valor literal `true` busca rascunhos; omitido ou outro valor busca pedidos enviados (`draft: false`) |

Exemplos: `GET /orders` lista enviados; `GET /orders?draft=true` lista rascunhos.

Resposta `200`:

```json
[
  {
    "id": "c246ba8f-4075-4870-b8b4-61080b51fdf6",
    "table": 7,
    "name": "Ana",
    "draft": false,
    "status": false,
    "createdAt": "2026-10-19T12:00:00.000Z",
    "items": [
      {
        "id": "d957e756-c806-4df1-a151-8a6678aeea8d",
        "amount": 2,
        "product": {
          "id": "e947eac5-47f1-42a7-84d5-80aacb5f9c8a",
          "name": "Margherita",
          "price": 3590,
          "description": "Molho, queijo e manjericão",
          "banner": "https://res.cloudinary.com/demo/image/upload/pizza.jpg"
        }
      }
    ]
  }
]
```

### `POST /order/add`

Adiciona produto ativo a um pedido. Requer autenticação.

Body JSON:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `order_id` | string | Sim | ID do pedido |
| `product_id` | string | Sim | ID de produto ativo |
| `amount` | number inteiro | Sim | Maior que zero |

Exemplo:

```http
POST /order/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": "c246ba8f-4075-4870-b8b4-61080b51fdf6",
  "product_id": "e947eac5-47f1-42a7-84d5-80aacb5f9c8a",
  "amount": 2
}
```

Resposta `201`:

```json
{
  "id": "d957e756-c806-4df1-a151-8a6678aeea8d",
  "amount": 2,
  "order_id": "c246ba8f-4075-4870-b8b4-61080b51fdf6",
  "product_id": "e947eac5-47f1-42a7-84d5-80aacb5f9c8a",
  "createdAt": "2026-10-19T12:00:00.000Z",
  "product": {
    "id": "e947eac5-47f1-42a7-84d5-80aacb5f9c8a",
    "name": "Margherita",
    "price": 3590,
    "description": "Molho, queijo e manjericão",
    "banner": "https://res.cloudinary.com/demo/image/upload/pizza.jpg"
  }
}
```

Pedido inexistente retorna `Pedido não encontrado.`; produto inexistente ou desativado retorna `Produto não encontrado.`.

### `DELETE /order/remove`

Remove um item de pedido. Requer autenticação.

Query:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `item_id` | string | Sim | ID do item |

Exemplo: `DELETE /order/remove?item_id=d957e756-c806-4df1-a151-8a6678aeea8d`

Resposta `200`:

```json
{ "message": "Item removido com sucesso." }
```

### `GET /order/detail`

Busca dados do pedido, itens e produtos relacionados. Requer autenticação.

Query:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `order_id` | string | Sim | ID do pedido |

Exemplo: `GET /order/detail?order_id=c246ba8f-4075-4870-b8b4-61080b51fdf6`

Resposta `200`:

```json
{
  "id": "c246ba8f-4075-4870-b8b4-61080b51fdf6",
  "table": 7,
  "name": "Ana",
  "draft": false,
  "status": false,
  "createdAt": "2026-10-19T12:00:00.000Z",
  "items": [
    {
      "id": "d957e756-c806-4df1-a151-8a6678aeea8d",
      "amount": 2,
      "createdAt": "2026-10-19T12:01:00.000Z",
      "product": {
        "id": "e947eac5-47f1-42a7-84d5-80aacb5f9c8a",
        "name": "Margherita",
        "price": 3590,
        "description": "Molho, queijo e manjericão",
        "banner": "https://res.cloudinary.com/demo/image/upload/pizza.jpg"
      }
    }
  ]
}
```

Pedido inexistente retorna `Pedido não encontrado.`.

### `PUT /order/send`

Envia o pedido à produção, alterando `draft` para `false`. Requer autenticação.

Query:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `order_id` | string | Sim | ID do pedido em rascunho |

Exemplo: `PUT /order/send?order_id=c246ba8f-4075-4870-b8b4-61080b51fdf6`

Resposta `200`: objeto do pedido atualizado, com `id`, `table`, `name`, `draft`, `status`, `createdAt` e `items` (incluindo `id`, `amount` e produto com `id`, `name`, `price`, `description`, `banner`). O formato completo é igual ao exemplo de detalhe, sem o `createdAt` dentro de cada item.

Erros de aplicação: `Pedido não encontrado.` ou `Este pedido já foi enviado para produção.`.

### `PUT /order/finish`

Finaliza um pedido já enviado, alterando `status` para `true`. Requer autenticação.

Query:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `order_id` | string | Sim | ID de pedido enviado e ainda não finalizado |

Exemplo: `PUT /order/finish?order_id=c246ba8f-4075-4870-b8b4-61080b51fdf6`

Resposta `200`: mesmo formato do pedido retornado por `PUT /order/send`, agora com `status: true`.

Erros de aplicação: `Pedido não encontrado.`, `Este pedido ainda é um rascunho. Envie para produção antes de finalizar.` ou `Este pedido já está finalizado.`.

### `DELETE /order`

Exclui o pedido e seus itens em cascata. Requer autenticação. A rota não exige ADMIN atualmente.

Query:

| Propriedade | Tipo | Obrigatória | Regra |
| --- | --- | --- | --- |
| `order_id` | string | Sim | ID do pedido |

Exemplo: `DELETE /order?order_id=c246ba8f-4075-4870-b8b4-61080b51fdf6`

Resposta `200`:

```json
{ "message": "Pedido deletado com sucesso." }
```

Pedido inexistente retorna `Pedido não encontrado.`.

## Autenticação e erros comuns

- Rotas autenticadas recebem `Authorization: Bearer <jwt>`.
- Sem token: HTTP `401`, `{"error":"Token não fornecido"}`. Token inválido/expirado: HTTP `401`, `{"error":"Token inválido"}`.
- Acesso a rota ADMIN com papel diferente: HTTP `401`, `{"error":"Usuário sem permissão"}`.
- Erro Zod: HTTP `400`, com `error` e lista `details` contendo `message` e `path`.
- Erros de regra de negócio e exceções de controllers/services: HTTP `400`, `{"error":"<mensagem>"}` pelo middleware global.