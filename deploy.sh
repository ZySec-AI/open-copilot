#!/bin/bash

# Function to create a sample .env file
create_sample_env() {
  cat <<EOL > .env
# Sample .env file with dummy values

# OpenSearch Configuration
OPENSEARCH_INITIAL_ADMIN_PASSWORD=Max34AS9!0lk4ddfG
OPENSEARCH_HOST=opensearch-srv
OPENSEARCH_PORT=9200
OPENSEARCH_USERNAME=escopilot
OPENSEARCH_PASSWORD=Max34AS9!0lk4ddfG
FILE_INDEX_NAME=escopilot-files-v1

# MongoDB Configuration
DB_URL=mongodb+srv://svc_atlas_compass:L1Ccaoq6NPld4fuM@datasets.1ooacdk.mongodb.net/
MONGO_INITDB_ROOT_USERNAME=sample_username
MONGO_INITDB_ROOT_PASSWORD=sample_password

# API Keys
HUGGINGFACE_API_KEY=sample_huggingface_api_key
OPENAI_API_KEY=sample_openai_api_key

# Application Secrets
SECRET_KEY=Max34AS9!0lk4ddfG

# Additional Configuration
DB_NAME=zysec-db-test
VLLM_API_BASE=https://dg9icyj8cpozvb-8000.proxy.runpod.net/v1
REACT_APP_API_URL=http://localhost:8081
APP_STORE_JSON_PATH=app-store.json
APPLICATIONS_JSON_PATH=applications.json
LANGCHAIN_MODEL=sentence-transformers/all-MiniLM-L6-v2
IS_HISTORY_ENABLED=True
HISTORY_MESSAGES_COUNT=3
CHUNK_SIZE=4096
CHUNK_OVERLAP=50
DEFAULT_MODEL=0
K=3
ACCESS_TOKEN_EXPIRE=2
REFRESH_TOKEN_EXPIRE=100

# Settings
ENABLE_INTERNET=True
ENABLE_CYBER_NEWS=False
ENABLE_FETCH_CONTENT=True
MODE=zysec-demo
PRIVATE_BASE_URL=
PRIVATE_SECRET_KEY=

# Neo4j Configuration
ENABLE_GRAPHDB=True
NEO4J_URI=http://localhost:7883
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=test
EOL
  echo ".env file created with sample values. Please edit it with your actual values."
}

# Function to install Node.js using nvm
install_node() {
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  source ~/.bashrc
  nvm install v20.13.1
}

# Function to install Python 3.10 and pip
install_python() {
  sudo apt update
  sudo apt install -y python3.10-venv python3-pip
}

# Function to install pnpm
install_pnpm() {
  npm install -g pnpm
}

# Function to install Docker
install_docker() {
  sudo apt update
  sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt update
  sudo apt install -y docker docker.io
  sudo usermod -aG docker ${USER}
  su - ${USER}
}

# Check if .env file exists, if not, create it
if [ ! -f .env ]; then
  echo ".env file not found. Creating a sample .env file with dummy values..."
  create_sample_env
fi

# Load .env file
export $(grep -v '^#' .env | xargs)

# Install Node.js
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Installing Node.js using nvm..."
  install_node
else
  echo "Node.js is already installed."
fi

# Install Python
if ! command -v python3 &> /dev/null; then
  echo "Python 3.10 not found. Installing Python 3.10..."
  install_python
else
  echo "Python 3.10 is already installed."
fi

# Install pnpm
if ! command -v pnpm &> /dev/null; then
  echo "pnpm not found. Installing pnpm..."
  install_pnpm
else
  echo "pnpm is already installed."
fi

# Install Docker
if ! command -v docker &> /dev/null; then
  echo "Docker not found. Installing Docker..."
  install_docker
else
  echo "Docker is already installed."
fi

# Create necessary directories for logs and data
mkdir -p ./workspace/mongo-srv/mongo-db
mkdir -p ./workspace/mongo-srv/logs
mkdir -p ./workspace/opensearch-srv/indexes
mkdir -p ./workspace/opensearch-srv/logs
mkdir -p ./workspace/neo4j-srv/data
mkdir -p ./workspace/neo4j-srv/logs
mkdir -p ./workspace/web-srv/user-files
mkdir -p ./workspace/web-srv/logs
mkdir -p ./workspace/api-srv/logs

# Set permissions if necessary
sudo chown -R 999:999 ./workspace/mongo-srv/mongo-db ./workspace/mongo-srv/logs
sudo chown -R 7474:7474 ./workspace/neo4j-srv/data ./workspace/neo4j-srv/logs

# Ensure the directories are writable
sudo chmod -R 777 ./workspace/mongo-srv/mongo-db ./workspace/mongo-srv/logs
sudo chmod -R 777 ./workspace/opensearch-srv/indexes ./workspace/opensearch-srv/logs
sudo chmod -R 777 ./workspace/neo4j-srv/data ./workspace/neo4j-srv/logs
sudo chmod -R 777 ./workspace/web-srv/user-files ./workspace/web-srv/logs
sudo chmod -R 777 ./workspace/api-srv/logs

echo "Environment setup is complete."
