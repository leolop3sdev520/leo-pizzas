<div align="center">
  <h1>🍕 Leo Pizzas</h1>
  <p><strong>Gestão completa, ágil e intuitiva para a sua pizzaria.</strong></p>

  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

<br />

## 📌 Sobre o Projeto

O **Leo Pizzas** é um sistema Fullstack de gestão de pedidos e cardápio, construído para otimizar o fluxo de trabalho de restaurantes. O projeto vai além de um simples CRUD, aplicando regras de negócio reais e separação de permissões (Admin, Garçom e Cozinha), com um design focado em usabilidade e performance.

## 🚀 Funcionalidades Principais

O sistema foi desenhado com base em três pilares operacionais:

### 👑 Painel do Administrador (Admin)
- **Gestão de Categorias:** Criação, listagem e "Soft Delete" (desativação lógica) com reativação inteligente em cascata.
- **Gestão de Produtos:** Cadastro com upload de imagem para o Cloudinary, definição de preço, descrição e vínculo com categorias. Itens desativados ficam em preto e branco visualmente.
- **Dashboard de Produtos:** Listagem agrupada por categoria, com foco em leitura rápida e edição via modal dinâmico.

### 🏃‍♂️ Área do Garçom (Staff)
- **Gestão de Mesas:** Abertura de mesas, registro do nome do cliente e identificação do garçom logado.
- **Lançamento de Pedidos:** Adição de múltiplos itens (rodadas) em uma mesma mesa, com cálculo de subtotal em tempo real.
- **Fechamento de Conta:** Envio de pedidos para a cozinha e opção de fechar a mesa (deletando o registro) com modal de confirmação seguro.

### 👨‍🍳 Painel da Cozinha (KDS - Kitchen Display System)
- **Visualização em Tempo Real:** Os pedidos aparecem assim que o garçom os envia.
- **Contador de Tempo:** Indicador visual que muda de cor (verde, laranja, vermelho) conforme o pedido se aproxima do tempo limite de preparo.
- **Gestão de Status:** O cozinheiro marca item por item como "Pronto" sem precisar sair da tela.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído como um **Monorepo**, separando o servidor (API) e o cliente (Web).

### Backend (API REST)
- **Node.js + Express:** Criação da API.
- **TypeScript:** Tipagem estática e segurança no código.
- **Prisma ORM:** Modelagem e comunicação com o banco.
- **PostgreSQL:** Banco de dados relacional.
- **JWT (JSON Web Tokens):** Autenticação baseada em tokens.
- **Bcryptjs:** Criptografia de senhas.
- **Zod:** Validação de schemas.
- **Multer + Cloudinary:** Upload e armazenamento de imagens.

### Frontend (Web App)
- **Next.js (App Router):** Framework React com Server e Client Components.
- **Tailwind CSS:** Estilização rápida e responsiva.
- **Shadcn UI:** Componentes acessíveis e customizáveis.
- **Sonner:** Notificações Toast elegantes.
- **Lucide React:** Biblioteca de ícones.

## 🎨 Design System (UX/UI)

- **Tema "Tijolo & Forno":** Paleta de cores *Dark Mode* aquecida (terracota, laranja cobre e creme), projetada para reduzir a fadiga visual de funcionários durante longos turnos.
- **Acessibilidade:** Componentes construídos com foco em contraste e áreas de clique (Lei de Fitts), ideais para dispositivos touch e uso rápido.
- **Arquitetura de Componentes:** Uso estratégico de Server Components no Next.js para carregar dados no servidor e Client Components apenas onde há interatividade.

## ⚙️ Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 18+)
- PostgreSQL instalado
- Conta no Cloudinary (para imagens)

### 1. Clonar o repositório
```bash
git clone https://github.com/leolop3sdev520/leo-pizzas.git
cd leo-pizzas
```

### 2. Configurar o Backend
```bash
cd backend
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/leopizzas?schema=public"
JWT_SECRET="sua_chave_secreta_super_segura"
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
PORT=3333
```

Rode as migrações do banco e inicie o servidor:
```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Configurar o Frontend
Abra um novo terminal na raiz do projeto e execute:
```bash
cd frontend
npm install
```

Crie um arquivo `.env.local` na pasta `frontend`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3333"
```

Inicie o frontend:
```bash
npm run dev
```

Acesse a aplicação em `http://localhost:3000`.

## 🌍 Deploy em Produção

- **Frontend:** Hospedado na [Vercel](https://vercel.com).
- **Backend e Banco de Dados:** Hospedados no [Render](https://render.com).

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar como base para seus próprios estudos.

---
Desenvolvido com ❤️ e muita pizza por [Leo Lopes](https://github.com/leolop3sdev520).
