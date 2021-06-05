# Build Env
FROM node:latest as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY .env.production .env
COPY . ./
RUN yarn build

# Production env
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# For React Router
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]