FROM node:19.7

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json /app
RUN npm install

# Bundle app source
COPY . .
CMD npm run build && npm run start