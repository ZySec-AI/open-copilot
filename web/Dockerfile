# Use an official Node.js runtime as a parent image
FROM node:24

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL
RUN npm run build

# Make port 5471 available to the world outside this container
EXPOSE 5471

# Run the app (serve the built files)
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "5471"]
