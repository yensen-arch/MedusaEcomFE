# Use Node.js as the base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
