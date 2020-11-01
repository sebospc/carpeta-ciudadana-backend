FROM node:14.15.0-alpine3.10

LABEL version="1.0"
LABEL description="app"
LABEL maintainer="Sebastian Ospina - sospin26@eafit.edu.co"

# Create app directory
RUN mkdir /app
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /app/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /app

ENV NODE_ENV staging
ENV PORT 3000

EXPOSE 3000

CMD [ "npm","start" ]