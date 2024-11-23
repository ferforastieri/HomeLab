#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Iniciando deploy do frontend..."

# Verificar ambiente Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js não encontrado!${NC}"
    exit 1
fi

# Instalar dependências
echo "Instalando dependências..."
npm install --production

# Construir aplicação
echo "Construindo aplicação..."
npm run build

if [ $? -eq 0 ]; then
    # Copiar arquivos para diretório de produção
    echo "Copiando arquivos para produção..."
    sudo cp -r build/* /var/www/servidor-pessoal/frontend/
    
    # Ajustar permissões
    sudo chown -R www-data:www-data /var/www/servidor-pessoal/frontend
    sudo chmod -R 755 /var/www/servidor-pessoal/frontend
    
    # Reiniciar Nginx
    echo "Reiniciando Nginx..."
    sudo systemctl restart nginx
    
    echo -e "${GREEN}Deploy concluído com sucesso!${NC}"
else
    echo -e "${RED}Erro na construção. Deploy cancelado.${NC}"
    exit 1
fi