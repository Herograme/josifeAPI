FROM node:20.17.0

# Create app directory
WORKDIR /usr/src/josifeapi

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]