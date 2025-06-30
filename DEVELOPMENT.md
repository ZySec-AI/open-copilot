# Development Guide

This guide will help you set up your development environment and understand the development workflow for OpenCopilot.

## Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Git** - For version control
- **Docker & Docker Compose** - For containerized development
- **Node.js 18+** - For frontend development
- **Python 3.10+** - For backend development
- **pnpm** - Preferred package manager for frontend

### 1. Fork and Clone

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/open-copilot.git
cd open-copilot
```

### 2. Environment Setup

```bash
# Copy the environment template
cp .env.example .env
# Edit .env with your configuration
```

### 3. Development Options

#### Option A: Full Docker Development (Recommended for beginners)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option B: Local Development (Recommended for active development)

```bash
# Start backend services (MongoDB, OpenSearch, Neo4j)
docker-compose up -d mongodb opensearch-srv neo4j

# Terminal 1: Start Backend
cd api
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8081

# Terminal 2: Start Frontend
cd web
npm install
npm start
```

#### Option C: VS Code Dev Containers (Recommended for consistent environment)

1. Install the "Dev Containers" extension in VS Code
2. Open the project in VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type "Dev Containers: Reopen in Container"
5. Wait for the container to build and start

## Development Workflow

### 1. Branch Strategy

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/bug-description

# For documentation
git checkout -b docs/documentation-improvement
```

### 2. Making Changes

#### Backend Development (FastAPI)

```bash
cd api

# Install new dependencies
pip install package-name
pip freeze > requirements.txt

# Run tests
python -m pytest tests/

# Run linting
flake8 .

# Format code
black .
```

#### Frontend Development (React)

```bash
cd web

# Install new dependencies
npm install package-name

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

### 3. Testing

#### Running Tests Locally

```bash
# Backend tests
cd api
python -m pytest tests/ -v

# Frontend tests
cd web
npm test

# Integration tests (if available)
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

#### Test Coverage

```bash
# Python coverage
cd api
pip install coverage
coverage run -m pytest
coverage report
coverage html  # Creates htmlcov/index.html

# JavaScript coverage
cd web
npm test -- --coverage
```

### 4. Code Quality

#### Pre-commit Hooks (Recommended)

```bash
pip install pre-commit
pre-commit install

# Run on all files
pre-commit run --all-files
```

#### Manual Quality Checks

```bash
# Python
cd api
flake8 .
black --check .
mypy .

# JavaScript/TypeScript
cd web
npm run lint
npm run type-check
```

## Development Tools

### Database Access

#### MongoDB
- **URL:** `mongodb://localhost:27017`
- **Admin UI:** MongoDB Compass or Studio 3T
- **Database:** `opencopilot` (or as specified in .env)

#### OpenSearch
- **URL:** `http://localhost:9200`
- **Dashboard:** `http://localhost:5601` (if Dashboards is enabled)
- **Credentials:** admin/admin (default)

#### Neo4j
- **URL:** `bolt://localhost:7687`
- **Browser:** `http://localhost:7474`
- **Credentials:** neo4j/password (default)

### API Documentation

- **Swagger UI:** `http://localhost:8081/docs`
- **ReDoc:** `http://localhost:8081/redoc`

### Hot Reloading

Both frontend and backend support hot reloading:

- **Frontend:** Changes are automatically reflected in the browser
- **Backend:** FastAPI with `--reload` flag restarts on file changes

## Project Structure

```
open-copilot/
├── api/                    # Python FastAPI backend
│   ├── app/
│   │   ├── api/endpoints/  # API route handlers
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Python dependencies
├── web/                    # React frontend
│   ├── src/
│   │   ├── component/      # React components
│   │   ├── redux/          # State management
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom hooks
│   ├── public/             # Static assets
│   └── package.json        # Node.js dependencies
├── .github/                # GitHub templates and workflows
├── .devcontainer/          # VS Code dev container config
└── docker-compose.yml      # Docker services configuration
```

## Common Development Tasks

### Adding a New Feature

1. **Plan the Feature**
   - Check existing issues or create a new one
   - Discuss the approach in the issue

2. **Backend Changes**
   ```bash
   # Add database model
   # Create service layer
   # Add API endpoints
   # Write tests
   ```

3. **Frontend Changes**
   ```bash
   # Create/update components
   # Add Redux state management
   # Update API services
   # Add tests
   ```

4. **Integration**
   ```bash
   # Test the full workflow
   # Update documentation
   # Create pull request
   ```

### Debugging

#### Backend Debugging

```bash
# Enable debug mode
export DEBUG=True

# Use debugger
import pdb; pdb.set_trace()

# Check logs
docker-compose logs api
```

#### Frontend Debugging

```bash
# Enable verbose logging
export REACT_APP_DEBUG=true

# Use browser dev tools
console.log()
debugger;

# Check logs
docker-compose logs web
```

### Performance Monitoring

#### Backend Performance

```bash
# Profile API endpoints
pip install py-spy
py-spy record -o profile.svg -- python app/main.py

# Monitor database queries
# Enable MongoDB profiling
# Check slow query logs
```

#### Frontend Performance

```bash
# Bundle analysis
npm run build
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer build/static/js/*.js

# React DevTools Profiler
# Chrome DevTools Performance tab
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using the port
lsof -i :8081
lsof -i :3000

# Stop conflicting services
sudo killall -9 node
docker-compose down
```

#### Database Connection Issues
```bash
# Reset databases
docker-compose down -v
docker-compose up -d

# Check database status
docker-compose ps
docker-compose logs mongodb
```

#### Permission Issues (Linux/Mac)
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod +x run.sh deploy.sh
```

### Getting Help

1. **Check Documentation** - README.md, ARCHITECTURE.md
2. **Search Issues** - Look for similar problems
3. **Ask in Discussions** - Use GitHub Discussions
4. **Create an Issue** - If you find a bug or need help

## Contributing Guidelines

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed information about:

- Code style guidelines
- Commit message conventions
- Pull request process
- Code review guidelines

## Resources

- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **React Documentation:** https://react.dev/
- **Docker Documentation:** https://docs.docker.com/
- **MongoDB Documentation:** https://docs.mongodb.com/
- **OpenSearch Documentation:** https://opensearch.org/docs/

Happy coding! 🚀 