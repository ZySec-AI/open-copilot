# OpenCopilot 🚀

[![CI/CD Pipeline](https://github.com/ZySec-AI/open-copilot/actions/workflows/ci.yml/badge.svg)](https://github.com/ZySec-AI/open-copilot/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Contributors](https://img.shields.io/github/contributors/ZySec-AI/open-copilot.svg)](https://github.com/ZySec-AI/open-copilot/graphs/contributors)
[![Issues](https://img.shields.io/github/issues/ZySec-AI/open-copilot.svg)](https://github.com/ZySec-AI/open-copilot/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/ZySec-AI/open-copilot.svg)](https://github.com/ZySec-AI/open-copilot/pulls)

OpenCopilot is an AI-powered cybersecurity assistant that helps organizations enhance their security posture through intelligent document management, expert knowledge systems, and advanced chat capabilities.

## 🌟 Features

- **AI-Powered Chat**: Intelligent conversations with cybersecurity experts
- **Document Management**: Advanced search and organization of security documents
- **Knowledge Graph**: Neo4j-powered relationships and insights
- **Multi-Database Support**: MongoDB, OpenSearch, and Neo4j integration
- **Real-time Collaboration**: WebSocket-based live interactions
- **Modern UI**: React-based responsive interface with Tailwind CSS
- **Containerized Deployment**: Docker and Docker Compose support

## 📚 Documentation

- **[Getting Started](#getting-started)** - Quick setup guide
- **[Development Guide](./DEVELOPMENT.md)** - Detailed development instructions
- **[Architecture Overview](./ARCHITECTURE.md)** - System design and components
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute
- **[Security Policy](./SECURITY.md)** - Security and vulnerability reporting
- **[Changelog](./CHANGELOG.md)** - Release notes and changes

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- Docker & Docker Compose
- Node.js 18+ with npm/pnpm
- Python 3.10+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZySec-AI/open-copilot.git
   cd open-copilot
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```

4. **Or run locally for development**
   ```bash
   # Start backend services
   docker-compose up -d mongodb opensearch-srv neo4j
   
   # Start backend
   cd api && pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8081
   
   # Start frontend (new terminal)
   cd web && npm install && npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8081
   - API Documentation: http://localhost:8081/docs

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### For New Contributors

1. **🍴 Fork the repository** on GitHub
2. **📥 Clone your fork** locally
3. **🌿 Create a feature branch** (`git checkout -b feature/amazing-feature`)
4. **💻 Make your changes** and test them
5. **📝 Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **📤 Push to your fork** (`git push origin feature/amazing-feature`)
7. **🔄 Open a Pull Request**

### Quick Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/open-copilot.git
cd open-copilot

# Set up development environment
./scripts/setup-dev.sh  # (if available)

# Or use VS Code Dev Containers
# Install "Dev Containers" extension, then:
# Ctrl+Shift+P -> "Dev Containers: Reopen in Container"
```

### What Can You Contribute?

- 🐛 **Bug fixes** - Help us squash bugs
- ✨ **New features** - Add exciting capabilities
- 📖 **Documentation** - Improve guides and examples
- 🧪 **Tests** - Increase coverage and reliability
- 🎨 **UI/UX improvements** - Enhance user experience
- 🔧 **DevOps** - Improve deployment and CI/CD
- 🛡️ **Security** - Identify and fix vulnerabilities

### Development Resources

- **[Development Guide](./DEVELOPMENT.md)** - Complete development setup
- **[Architecture Guide](./ARCHITECTURE.md)** - Understanding the codebase
- **[API Documentation](http://localhost:8081/docs)** - Backend API reference
- **[Component Library](./web/src/component/ui/)** - Frontend components

## 📋 Project Overview

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

## 🤝 Community & Support

### Getting Help

- **📖 Documentation**: Check our comprehensive guides above
- **🐛 Issues**: [Report bugs or request features](https://github.com/ZySec-AI/open-copilot/issues)
- **💬 Discussions**: [Join community discussions](https://github.com/ZySec-AI/open-copilot/discussions)
- **🛡️ Security**: Report security issues to [security@yourorganization.com]

### Code of Conduct

Please read our [Code of Conduct](./.github/CODE_OF_CONDUCT.md) to understand the standards we expect from our community.

### License

This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.

### Acknowledgments

- FastAPI for the excellent Python web framework
- React community for the amazing frontend ecosystem
- All our contributors who make this project better

---

**⭐ Star this repository if you find it helpful!**

**🔗 Share it with others who might benefit from an AI-powered cybersecurity assistant**

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