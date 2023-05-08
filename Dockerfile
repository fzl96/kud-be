FROM node:19.7.0

# Create app directory
WORKDIR /app

COPY . .
RUN npm install

CMD ["npm", "start-2"]