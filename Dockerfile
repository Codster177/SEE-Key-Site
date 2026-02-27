# Use Node LTS
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of project
COPY . .

# Regenerate Prisma client from current schema
RUN npx prisma generate

# Make DATABASE_URL available at build time so webpack doesn't replace it with undefined
ENV DATABASE_URL=file:/app/data/dev.db

# Build Next.js
RUN NODE_OPTIONS="--max-old-space-size=512" npm run build

# Expose port
EXPOSE 3000

# Start production server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]