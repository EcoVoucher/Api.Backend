# Use uma imagem base Debian com Node.js
FROM node:22.11.0-bullseye

# Defina o diretório de trabalho dentro do container
WORKDIR /src

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos da aplicação
COPY . .

# Exponha a porta que o backend irá usar
EXPOSE 4000

# Comando para rodar o backend
CMD ["npm", "dev"]
