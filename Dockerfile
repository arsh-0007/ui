# Stage 1: Build Angular application
FROM node:22.23.2-alpine AS build

WORKDIR /app

# Use exact npm version
RUN npm install -g npm@11.18.0

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Angular source
COPY . .

# Build Angular application
RUN npm run build


# Stage 2: Nginx
FROM nginx:alpine

# Angular SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Angular build
COPY --from=build /app/dist/gardencare-ui/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]