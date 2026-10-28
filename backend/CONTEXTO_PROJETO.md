# Contexto do Projeto: Backend da Pizzaria

## Visão geral

API REST para operação de uma pizzaria: cadastro e autenticação de usuários, categorias, produtos com imagem e fluxo de pedidos da criação ao encerramento. A API é implementada em Node.js, TypeScript e Express 5, com PostgreSQL acessado por Prisma 7 e validação Zod.

As rotas são registradas diretamente no Express, sem prefixo global `/api`. Com a configuração padrão, a URL base local é `http://localhost:3333`.

## Tecnologias e execução

- Express `^5.2.1`, TypeScript `^7.0.2`, Prisma e `@prisma/client` `^7.10.0`, Zod `^4.6.5`.
- PostgreSQL via `pg` e `@prisma/adapter-pg`.
- Autenticação JWT (`jsonwebtoken`), hash de senha com `bcryptjs`.
- Upload de imagens com Multer em memória e Cloudinary.
- `npm run dev` inicia `tsx watch src/server.ts`.

Variáveis de ambiente usadas pelo código: `PORT` (opcional, padrão `3333`), `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET`. O banco e as credenciais do Cloudinary/JWT precisam estar configurados para as funcionalidades correspondentes.

## Arquitetura e pastas

Fluxo habitual: rota → middlewares → controller → service → Prisma/PostgreSQL → resposta JSON. Os controllers extraem os dados HTTP; os services concentram as regras de negócio e as consultas. `validateSchema` executa o schema Zod e substitui body/query/params pelos valores parseados, inclusive defaults e transforms.

```text
src/
  config/        Configuração de Multer e Cloudinary
  controllers/   Adaptadores HTTP por funcionalidade
  middlewares/   Autenticação, autorização e validação
  prisma/        Instância Prisma com adaptador PostgreSQL
  schemas/       Contratos de validação Zod
  services/      Regras de negócio e acesso aos dados
  generated/     Prisma Client gerado
  routes.ts      Registro dos endpoints
  server.ts      Express, JSON, CORS e tratamento de erros
prisma/
  schema.prisma  Modelos e relações
  migrations/    Migrações do banco
```

## Funcionalidades

- **Usuários e sessão:** cadastro, autenticação por e-mail/senha, JWT com validade de 30 dias e consulta do perfil autenticado. Senhas são armazenadas com hash bcrypt (custo 8); o hash não é retornado nos endpoints de usuário.
- **Categorias:** criação administrativa e listagem por data de criação decrescente.
- **Produtos:** criação administrativa com upload de imagem para a pasta `products` do Cloudinary; listagem por estado `disabled`; listagem de produtos ativos por categoria; desativação lógica.
- **Pedidos:** criação em rascunho, listagem por `draft`, consulta detalhada, inclusão e remoção de itens, envio para produção, finalização e exclusão.

## Controles de acesso e validação

### `isAuthenticated`

Lê `Authorization: Bearer <token>`, verifica o JWT usando `JWT_SECRET` e disponibiliza o `sub` do token como `req.user_id`. Sem token retorna `401` com `{"error":"Token não fornecido"}`; token inválido retorna `401` com `{"error":"Token inválido"}`.

### `isAdmin`

Consulta o usuário autenticado no banco e só permite `role: "ADMIN"`. Sem usuário ou com papel diferente, retorna `401` com `{"error":"Usuário sem permissão"}`. Não há endpoint público para promover usuários: o cadastro cria `STAFF` pelo default do Prisma.

### `validateSchema`

Aplica os schemas de `src/schemas` nas rotas que os registram. Erros Zod respondem `400` neste formato:

```json
{
  "error": "Erro de Validação",
  "details": [{ "message": "mensagem", "path": ["body", "campo"] }]
}
```

O middleware de erro do servidor converte exceções não tratadas em `400` com `{"error":"mensagem"}`. O fallback para erro não-`Error` retorna `500`. Portanto, vários erros de regra de negócio também chegam como HTTP 400, não como 404/409.

### Upload

O campo multipart esperado é `file`. Multer aceita JPEG/JPG/PNG até 4 MiB, mantém o conteúdo em memória e o service envia ao Cloudinary. O controller exige arquivo, mas a rota de criação de produto não aplica `createProductSchema`; campos de texto não recebem validação Zod nessa rota. O preço é convertido com `Number()` e deve ser enviado em centavos para corresponder ao banco.

## Modelo de dados

- **User:** `id` UUID, `name`, `email` único, `password` hash, `role` (`STAFF`/`ADMIN`, padrão `STAFF`), `createdAt`, `updatedAt`.
- **Category:** `id`, `name`, `createdAt`, `updatedAt`; possui vários produtos.
- **Product:** `id`, `name`, `price` inteiro em centavos, `description`, `banner` URL, `disabled` (padrão `false`), `category_id`, timestamps; pertence a uma categoria e pode aparecer em itens.
- **Order:** `id`, `table` inteiro, `name` opcional, `draft` (padrão `true`), `status` (padrão `false`), timestamps e itens.
- **Item:** `id`, `amount` inteiro, `order_id`, `product_id`, timestamps.

`onDelete: Cascade` está configurado para Category → Product, Product → Item e Order → Item. A remoção de produto exposta pela API é lógica (`disabled: true`), não exclusão física.

### Estado do pedido

| Campo | Significado implementado |
| --- | --- |
| `draft: true` | Rascunho; ainda não enviado à produção |
| `draft: false` | Enviado à produção |
| `status: false` | Ainda não finalizado |
| `status: true` | Finalizado |

O fluxo previsto é criar → adicionar/remover itens → enviar (`draft: false`) → finalizar (`status: true`). O envio impede reenvio; finalização exige pedido enviado e ainda não finalizado. O código não impede alterações de itens após envio nem finalização com lista vazia.

## Controllers e Services

| Funcionalidade | Controller | Service | Responsabilidade |
| --- | --- | --- | --- |
| Usuários | `CreateUserController` | `CreateUserService` | Verifica e-mail existente, aplica hash e cria usuário |
| Sessão | `AuthUserController` | `AuthUserService` | Confere senha e emite JWT |
| Perfil | `DetailUserController` | `DetailUserService` | Busca perfil sem senha |
| Criar categoria | `CreateCategoryController` | `CreateCategoryService` | Persiste categoria |
| Listar categorias | `ListCategoryController` | `ListCategoryService` | Lista categorias recentes primeiro |
| Criar produto | `CreateProductController` | `CreateProductService` | Verifica categoria, envia imagem ao Cloudinary e cria produto |
| Listar produtos | `ListProductController` | `ListProductService` | Filtra por `disabled` e inclui dados da categoria |
| Produtos da categoria | `ListProductByCategoryController` | `ListProductByCategoryService` | Verifica categoria e lista somente produtos ativos |
| Desativar produto | `DeleteProductController` | `DeleteProductService` | Define `disabled: true` |
| Criar pedido | `CreateOrderController` | `CreateOrderService` | Cria pedido em rascunho |
| Listar pedidos | `ListOrdersController` | `ListOrdersService` | Filtra `draft` e inclui itens/produtos |
| Adicionar item | `AddItemController` | `AddItemOrderService` | Verifica pedido/produto ativo e cria item |
| Remover item | `RemoveItemController` | `RemoveItemOrderService` | Verifica e exclui item |
| Detalhar pedido | `DetailOrderController` | `DetailOrderService` | Busca pedido com itens e produtos |
| Enviar pedido | `SendOrderController` | `SendOrderService` | Marca pedido como enviado à produção |
| Finalizar pedido | `FinishOrderController` | `FinishOrderService` | Marca como finalizado após envio |
| Excluir pedido | `DeleteOrderController` | `DeleteOrderService` | Exclui pedido e seus itens em cascata |

## Rotas

O detalhamento de todos os 17 endpoints, incluindo campos, exemplos e respostas, está em [endpoints.md](endpoints.md).

| Método | Rota | Acesso |
| --- | --- | --- |
| POST | `/users` | Público |
| POST | `/session` | Público |
| GET | `/me` | Autenticado |
| POST / GET | `/category` | POST admin; GET autenticado |
| GET | `/category/product` | Autenticado |
| POST / DELETE | `/product` | Autenticado + admin |
| GET | `/products` | Autenticado |
| POST / DELETE | `/order` | Autenticado |
| GET | `/orders` | Autenticado |
| POST | `/order/add` | Autenticado |
| DELETE | `/order/remove` | Autenticado |
| GET | `/order/detail` | Autenticado |
| PUT | `/order/send` | Autenticado |
| PUT | `/order/finish` | Autenticado |

## Observações de implementação

- `GET /orders` não possui schema de query: apenas `draft=true` seleciona rascunhos; qualquer outro valor, inclusive ausência, seleciona pedidos enviados (`draft=false`).
- `GET /products` aceita `disabled=true|false`; quando omitido, o default é `false` (produtos ativos).
- `POST /order` e `POST /order/add` esperam números JSON para `table` e `amount`.
- `POST /product` espera `price` como campo multipart string, mas o valor armazenado deve representar centavos; não há validação explícita de número inteiro/positivo no controller/service.
- Não há paginação, endpoint de edição de produto/categoria, reativação de produto ou endpoint para promover usuário no conjunto atual de rotas.