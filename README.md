# CyberPOD AI

## Overview

This project is a web application that leverages several technologies including MongoDB, OpenSearch, Neo4j, and a React frontend. The project is set up to run both locally and within Docker containers.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Docker
- Docker Compose
- Python 3.10+
- Node.js 20+ with pnpm

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ZySec-AI/es-copilot.git
cd es-copilot
```

### 2. Environment Configuration

This project requires a `.env` file for configuration. If the `.env` file does not exist, it will be created with sample values.

### 3. Deployment

#### Using Deployment Script

The `deploy.sh` script automates the setup and installation of necessary tools and services. It includes:

- Creating the `.env` file if it doesn't exist.
- Installing Node.js using nvm.
- Installing Python 3.10 and pip.
- Installing pnpm.
- Installing Docker.
- Creating necessary directories for logs and data with correct permissions.

To run the deployment script:

```bash
./deploy/deploy.sh
```

### 4. Running the Application

The `run.sh` script is used to manage the startup process. It can either run the entire application using Docker Compose (containerized mode) or run the frontend and backend locally (developer mode).

#### Using Docker Compose (Containerized Mode)

To run the application in containerized mode:

```bash
./run.sh prod
```

#### Running Locally (Developer Mode)

To run the application locally for development purposes, use the `dev` argument.

- To start both frontend and backend:

  ```bash
  ./run.sh dev
  ```

- To start only the frontend:

  ```bash
  ./run.sh dev fe
  ```

- To start only the backend:

  ```bash
  ./run.sh dev be
  ```

### 5. Utilities

#### Resetting Passwords

The `utils/reset_password.sh` script can be used to reset passwords for various services. Replace `username` and `new_password` with appropriate values.

```bash
./utils/reset_password.sh username new_password
```

#### Backup and Restore

The `utils/backup.sh` and `utils/restore.sh` scripts are available for backing up and restoring the database. 

- To backup the database:

  ```bash
  ./utils/backup.sh
  ```

- To restore the database:

  ```bash
  ./utils/restore.sh backup_file
  ```

### 6. Configuring Initial Data and Security

- Populate the database with initial data.
- Ensure system security settings are configured (e.g., firewalls, secure access).

### 7. Running Tests

- Execute tests to verify system functionality.
- Check integrations with external systems.

### 8. Setting Up Monitoring and Logging

- Configure system monitoring.
- Set up logging for important events.

### 9. Establishing Backup and Recovery Procedures

- Implement regular backups.
- Ensure recovery procedures are documented and tested.

## Environment Variables

The following environment variables are used by the application and should be set in the `.env` file. Replace the sample values with actual values before running the application.

```dotenv
# OpenSearch Configuration
OPENSEARCH_INITIAL_ADMIN_PASSWORD=your_opensearch_password
OPENSEARCH_HOST=opensearch-srv
OPENSEARCH_PORT=9200
OPENSEARCH_USERNAME=your_opensearch_username
OPENSEARCH_PASSWORD=your_opensearch_password
FILE_INDEX_NAME=escopilot-files-v1

# MongoDB Configuration
DB_URL=mongodb+srv://your_mongo_username:your_mongo_password@datasets.1ooacdk.mongodb.net/
MONGO_INITDB_ROOT_USERNAME=your_mongo_username
MONGO_INITDB_ROOT_PASSWORD=your_mongo_password

# API Keys
HUGGINGFACE_API_KEY=your_huggingface_api_key
OPENAI_API_KEY=your_openai_api_key

# Application Secrets
SECRET_KEY=your_secret_key

# Additional Configuration
DB_NAME=your_db_name
VLLM_API_BASE=https://your_vllm_api_base
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
NEO4J_PASSWORD=your_neo4j_password
```

### Note

- The MongoDB connection string should not include a port number when using the `mongodb+srv` scheme.
- Make sure to update the sample values in the `.env` file with actual values before running the application.

## Troubleshooting

If you encounter issues, check the logs of the running services:

```bash
docker-compose -f deploy/docker-compose.yml logs
```

For specific services, you can use:

```bash
docker-compose -f deploy/docker-compose.yml logs <service_name>
```

For example:

```bash
docker-compose -f deploy/docker-compose.yml logs web-srv
docker-compose -f deploy/docker-compose.yml logs api-srv
docker-compose -f deploy/docker-compose.yml logs mongo-srv
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Updated Folder Structure

```markdown
.
├── README.md
├── api
│   └── ... (API related files and directories)
├── deploy
│   ├── README.md
│   ├── deploy.sh
│   └── docker-compose.yml
├── run.sh
├── utils
│   ├── backup.sh
│   ├── restore.sh
│   └── reset_password.sh
├── web
│   └── ... (Web related files and directories)
└── workspace
    └── ... (Workspace related files and directories)
```

`run.sh` script is used to start the application in different modes, while `deploy.sh` is responsible for initial setup and installation. The `utils` directory contains scripts for maintenance tasks like backups and password resets. This organization should help streamline the deployment and maintenance process.