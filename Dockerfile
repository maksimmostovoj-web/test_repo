FROM mcr.microsoft.com/playwright:v1.58.2-noble
# WORKDIR
COPY . .
RUN npm ci
CMD ["npm", "t"]