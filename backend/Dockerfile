# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install deps
COPY package*.json tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["npm", "start"]