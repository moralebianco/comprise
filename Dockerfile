FROM node:23.8
WORKDIR /app

COPY setup.sh package*json ./
RUN npm install --production

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
