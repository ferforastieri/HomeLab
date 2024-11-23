# Servidor Pessoal

Um painel administrativo para gerenciar arquivos e monitorar recursos do sistema, desenvolvido com React e Node.js.

## 📋 Visão Geral

Este projeto consiste em um painel administrativo que permite:
- Monitorar recursos do sistema (CPU, RAM, Armazenamento)
- Gerenciar arquivos e pastas
- Compartilhar arquivos através de links
- Controlar acessos e permissões

## 🚀 Começando

### Pré-requisitos

- Node.js (v14+)
- MongoDB
- NPM ou Yarn

### Instalação

1. Clone o repositório
git clone https://github.com/seu-usuario/servidor-pessoal.git
cd servidor-pessoal

2. Configure o Backend
cd backend
npm install
cp .env.example .env

3. Configure o Frontend
cd frontend
npm install
cp .env.example .env

4. Inicie os serviços
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

## 🛠️ Construído Com

### Backend
- **Node.js** - Ambiente de execução
- **Express** - Framework web
- **MongoDB** - Banco de dados
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **systeminformation** - Monitoramento do sistema

### Frontend
- **React** - Biblioteca UI
- **Material-UI** - Framework de design
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado

## 📁 Estrutura do Projeto

servidor-pessoal/
├── backend/               # API REST
│   ├── src/
│   │   ├── config/       # Configurações
│   │   ├── controllers/  # Controladores
│   │   ├── middleware/   # Middlewares
│   │   ├── models/       # Modelos do MongoDB
│   │   ├── routes/       # Rotas da API
│   │   └── services/     # Serviços
│   └── package.json
│
└── frontend/             # Interface do usuário
    ├── src/
    │   ├── components/   # Componentes React
    │   ├── context/      # Contextos
    │   ├── pages/        # Páginas
    │   ├── services/     # Serviços
    │   └── utils/        # Utilitários
    └── package.json

## ⚙️ Configuração

### Backend (.env)
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/servidor-pessoal
JWT_SECRET=seu_secret_aqui
JWT_EXPIRES_IN=7d
STORAGE_PATH=./uploads

### Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STORAGE_URL=http://localhost:5000/uploads

## 📦 Scripts Disponíveis

### Backend
npm run dev     # Desenvolvimento
npm start       # Produção

### Frontend
npm start       # Desenvolvimento
npm build       # Build de produção

## 🔒 Segurança

- Autenticação via JWT
- Senhas criptografadas (bcrypt)
- Proteção contra CSRF
- Validação de entrada
- Sanitização de arquivos
- Rate limiting

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas alterações (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT

## 📝 Notas

- O projeto está em desenvolvimento ativo
- Recomendado usar as últimas versões estáveis do Node.js e MongoDB
- Certifique-se de configurar corretamente as variáveis de ambiente
