# Architecture Overview

This document provides an overview of the OpenCopilot architecture to help contributors understand the system design and make informed decisions when contributing.

## System Architecture

OpenCopilot follows a microservices architecture with the following main components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web    │    │   FastAPI       │    │   Databases     │
│   Frontend      │◄──►│   Backend       │◄──►│   & Services    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture (React)

**Location:** `/web`

### Key Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management with modern Redux patterns
- **React Router** - Client-side routing

### Directory Structure
```
web/src/
├── component/          # Reusable UI components
│   ├── chat/          # Chat-related components
│   ├── documents/     # Document management UI
│   ├── profile/       # User profile components
│   └── ui/            # Basic UI components (buttons, forms, etc.)
├── redux/             # State management
├── services/          # API service layer
├── hooks/             # Custom React hooks
└── lib/               # Utility libraries
```

### Key Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Chat** - WebSocket integration for live conversations
- **Document Management** - File upload, organization, and search
- **User Management** - Authentication, profiles, and permissions

## Backend Architecture (FastAPI)

**Location:** `/api`

### Key Technologies
- **FastAPI** - Modern, fast Python web framework
- **Pydantic** - Data validation using Python type annotations
- **Motor** - Async MongoDB driver
- **OpenSearch** - Full-text search and analytics
- **Neo4j** - Graph database for relationships
- **WebSockets** - Real-time communication

### Directory Structure
```
api/app/
├── api/endpoints/     # API route handlers
├── core/             # Core configuration and utilities
├── models/           # Data models
│   ├── mongodb/      # MongoDB models
│   ├── pydantics/    # Pydantic schemas
│   └── graph_models/ # Neo4j graph models
├── services/         # Business logic layer
│   ├── ai_services/  # AI and ML services
│   └── domain_services/ # Core business services
└── utils/            # Utility functions and helpers
```

### Key Services

#### AI Services
- **LLM Service** - Integration with OpenAI and other language models
- **Text Embedding** - Document vectorization for semantic search
- **Graph Connection** - Knowledge graph analysis

#### Domain Services
- **Authentication** - JWT-based auth with refresh tokens
- **Chat Service** - Conversation management and history
- **Document Service** - File processing and indexing
- **Expert Service** - AI assistant management

## Database Architecture

### MongoDB
- **Purpose:** Primary data store for structured data
- **Collections:** Users, chats, messages, documents, categories
- **Features:** Transactions, indexing, aggregation pipelines

### OpenSearch
- **Purpose:** Full-text search and document indexing
- **Features:** Semantic search, faceted search, analytics
- **Integration:** Document content indexing, search suggestions

### Neo4j (Optional)
- **Purpose:** Knowledge graph and relationship modeling
- **Features:** Graph queries, relationship analysis
- **Use Cases:** Entity relationships, knowledge discovery

## API Design

### RESTful Endpoints
- **Authentication:** `/api/auth/*`
- **Chat:** `/api/chat/*`
- **Documents:** `/api/documents/*`
- **Users:** `/api/users/*`
- **Experts:** `/api/experts/*`

### WebSocket Connections
- **Chat:** Real-time message exchange
- **Notifications:** System-wide notifications

## Security Architecture

### Authentication & Authorization
- **JWT Tokens** - Access and refresh token pattern
- **Role-based Access** - User permissions and roles
- **API Key Management** - Service-to-service authentication

### Data Protection
- **Input Validation** - Pydantic schemas for all inputs
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization and CSP headers

## Deployment Architecture

### Containerization
- **Docker** - All services containerized
- **Docker Compose** - Local development environment
- **Multi-stage Builds** - Optimized production images

### Environment Management
- **Development Mode** - Hot reloading, debug tools
- **Production Mode** - Optimized builds, security hardening

## Development Workflow

### Code Organization
1. **Separation of Concerns** - Clear boundaries between layers
2. **Dependency Injection** - Services injected into endpoints
3. **Error Handling** - Centralized exception handling
4. **Logging** - Structured logging throughout the application

### Testing Strategy
1. **Unit Tests** - Individual component testing
2. **Integration Tests** - Service-to-service testing
3. **E2E Tests** - Full user workflow testing

## Contributing Guidelines

### Adding New Features

1. **Backend Changes:**
   - Add models in appropriate directories
   - Create service layer logic
   - Add API endpoints
   - Update tests

2. **Frontend Changes:**
   - Create/update components
   - Add Redux actions/reducers if needed
   - Update services for API calls
   - Add tests

3. **Database Changes:**
   - Update models and schemas
   - Create migration scripts if needed
   - Update test data

### Performance Considerations

- **Async/Await** - Non-blocking operations throughout
- **Connection Pooling** - Database connection management
- **Caching** - Redis for session and frequently accessed data
- **Lazy Loading** - Frontend component and route splitting

## Monitoring & Observability

### Logging
- **Structured Logging** - JSON formatted logs
- **Log Levels** - Appropriate log levels for different environments
- **Correlation IDs** - Request tracing across services

### Metrics
- **Application Metrics** - Response times, error rates
- **Business Metrics** - User engagement, feature usage
- **Infrastructure Metrics** - System resource usage

This architecture is designed to be:
- **Scalable** - Can handle increased load
- **Maintainable** - Clear separation and documentation
- **Extensible** - Easy to add new features
- **Testable** - Designed for comprehensive testing 