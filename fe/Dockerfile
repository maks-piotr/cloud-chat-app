FROM node:18 AS build-stage

WORKDIR /app/chat-app

RUN npm install -g @angular/cli

COPY chat-app/package*.json ./

RUN npm install

COPY chat-app/ .

RUN npm run build -- --output-path=dist/chat-app --configuration=production

FROM nginx:1.23 AS production-stage

COPY --from=build-stage /app/chat-app/dist/chat-app/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

 EXPOSE 80

 CMD ["nginx", "-g", "daemon off;"]
