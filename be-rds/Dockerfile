# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy application code
COPY . .

# Install dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 8080

CMD ["node", "server.js"]