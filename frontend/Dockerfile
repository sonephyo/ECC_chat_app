FROM node:23-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# 4. Copy the rest of your application code
COPY . .

# 5. Build the Next.js app
RUN npm run build

# 6. Use a lighter base image to serve the built app
FROM node:23-bookworm-slim AS runner

WORKDIR /app

# Copy only necessary files from the builder stage
COPY package*.json ./
RUN npm install --omit=dev

# Copy the build output
COPY --from=builder /app/build ./build

# Expose the port Next.js runs on
EXPOSE 5173

# Start the app
CMD ["npm", "start"]