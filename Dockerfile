FROM node:8.4

WORKDIR /home/feathers
COPY README.md README.md
COPY package.json package.json
COPY config/ config/
COPY public/ public/
COPY src/ src/
RUN mkdir data/
ENV NODE_ENV 'production'
ENV PORT '3030'
RUN npm install --production
CMD ["node", "src/index.js"]
