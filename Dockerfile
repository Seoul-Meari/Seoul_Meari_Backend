# 1. Base Image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy all other source files
COPY . .

# 6. Build the application
RUN npm run build

# 7. Expose port and run the application
EXPOSE 3000
CMD ["node", "dist/main"]
