# 1️⃣ Use an official Node base image
FROM node:20

# 2️⃣ Set the working directory inside the container
WORKDIR /usr/src/app

# 3️⃣ Copy dependency files first (for caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy your app source code
COPY . .

# 6️⃣ Expose a port for the app to run on
EXPOSE 4000

# 7️⃣ Define the default command to start the app
CMD ["npm", "start"]
