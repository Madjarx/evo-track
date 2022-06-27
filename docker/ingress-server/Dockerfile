FROM node:12

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY ./server/package*.json /app
COPY ./package*.json /app

# Optimize by doing dual image build??
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
# Create volume!! 
# COPY ./server .

EXPOSE 3000
CMD [ "node", "app.js" ]
