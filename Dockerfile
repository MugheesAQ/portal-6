FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000 for the Vite dev server
EXPOSE 3000

# Start the Vite dev server
CMD ["npm", "run", "dev"]
