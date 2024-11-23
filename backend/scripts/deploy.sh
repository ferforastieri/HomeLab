#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Iniciando deploy..."

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}PM2 não encontrado. Instalando...${NC}"
    npm install -g pm2
fi

# Instalar dependências
echo "Instalando dependências..."
npm install --production

# Executar setup de produção
echo "Configurando ambiente de produção..."
node scripts/production-setup.js

# Verificar se há erros no código
echo "Verificando código..."
npm run lint

if [ $? -eq 0 ]; then
    # Iniciar aplicação com PM2
    echo "Iniciando aplicação..."
    pm2 start ecosystem.config.js --env production
    
    # Salvar configuração do PM2
    pm2 save
    
    echo -e "${GREEN}Deploy concluído com sucesso!${NC}"
else
    echo -e "${RED}Erro na verificação do código. Deploy cancelado.${NC}"
    exit 1
fi