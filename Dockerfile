FROM node:20.17.0

# Create app directory
WORKDIR /usr/src/josifeapi

# Install app dependencies
COPY package*.json ./
    
RUN npm install
RUN apt-get update && apt-get install -y openssl
RUN apt-get update && apt-get install -y curl
RUN apt-get update && apt-get install -y iputils-ping
RUN npm install google-spreadsheet google-auth-library

RUN npm ci --production

ENV NODE_OPTIONS="--openssl-legacy-provider"

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]