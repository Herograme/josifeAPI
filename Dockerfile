FROM node:20.17.0

# Create app directory
WORKDIR /usr/src/josifeapi

# Install app dependencies
COPY package*.json ./

ENV REDIS_URI=rediss://red-ct5a49ilqhvc73a7p240:vmTcZwESgUiyouMT7c6AMW2peSQHANhL@oregon-redis.render.com:6379 \
    HOST=localhost \
    PORT=4000 \
    NODE_ENV=production \
    USERNAME_HOST=herograme \
    PASSWORD_HOST=@Xaiome66\
    GOOGLE_SHEET_ID=1nt5KrftyQ66kk60Mz8avRDJiqxSMrjnS8C4_MZ44M04


    

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]