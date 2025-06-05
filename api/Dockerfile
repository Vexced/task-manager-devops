# Usar Node.js versión oficial LTS
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json para instalar deps
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer puerto en el que corre la app (ejemplo 3000)
EXPOSE 3000

# Comando para correr la app
CMD ["node", "app.js"]
