# Docker Setup for UniverLiga

This project includes Docker configuration for both development and production environments.

## File Structure

```
├── docker-compose.yml           # Production configuration
├── docker-compose.dev.yml       # Development configuration
├── frontend/
│   ├── Dockerfile              # Production frontend Dockerfile
│   ├── Dockerfile.dev          # Development frontend Dockerfile
│   ├── nginx.conf              # Nginx configuration for production
│   └── .dockerignore           # Files to ignore in Docker builds
└── backend/
    ├── Dockerfile              # Production backend Dockerfile
    ├── Dockerfile.dev          # Development backend Dockerfile
    └── .dockerignore           # Files to ignore in Docker builds
```

## Quick Start

### Development Environment (with hot reload)

1. **Start development services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the applications:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Backend API Documentation: http://localhost:8000/docs

3. **Stop development services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Production Environment

1. **Build and start production services:**
   ```bash
   docker-compose up --build -d
   ```

2. **Access the applications:**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8000
   - Backend API Documentation: http://localhost:8000/docs

3. **Stop production services:**
   ```bash
   docker-compose down
   ```

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory or set these in `docker-compose.yml`:

```env
DEBUG=false
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://frontend:80
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

## Services

### Backend Service
- **Port:** 8000
- **Framework:** FastAPI with Python 3.11
- **Database:** SQLite (mounted as volume)
- **Health Check:** `/health` endpoint
- **Development:** Hot reload enabled with `--reload` flag

### Frontend Service
- **Port:** 5173 (development), 80 (production)
- **Framework:** React + TypeScript + Vite
- **Production Server:** Nginx with optimized configuration
- **Development:** Hot module replacement enabled

## Useful Commands

### View logs
```bash
# Development logs
docker-compose -f docker-compose.dev.yml logs -f

# Production logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild services
```bash
# Rebuild development services
docker-compose -f docker-compose.dev.yml up --build

# Rebuild production services
docker-compose up --build -d
```

### Clean up
```bash
# Stop and remove containers, networks
docker-compose down

# Remove all Docker resources (containers, networks, volumes, images)
docker-compose down -v --rmi all
```

### Check service status
```bash
# List running containers
docker-compose ps

# Check service health
docker-compose -f docker-compose.yml ps
```

## Database

The application uses SQLite for simplicity. The database file (`app.db`) is mounted as a volume to persist data between container restarts.

### Reset database
```bash
# Stop services and remove volumes
docker-compose down -v

# Restart services (new database will be created)
docker-compose up --build -d
```

## Troubleshooting

### Port already in use
If ports 8000 or 80 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "8080:8000"  # Change backend port
  - "8081:80"    # Change frontend port
```

### Build cache issues
Clear Docker build cache:
```bash
docker builder prune -a
```

### Permission issues
If you encounter permission issues with mounted volumes:
```bash
# Fix permissions on host machine
sudo chown -R $USER:$USER ./backend/app.db
```

### Insufficient memory
If Docker runs out of memory during build:
```bash
# Increase Docker memory allocation in Docker Desktop settings
# Or clean up unused resources
docker system prune -a
```

## Production Considerations

1. **Security:** Change the `SECRET_KEY` environment variable in production
2. **Database:** Consider using PostgreSQL or MySQL for production instead of SQLite
3. **SSL/TLS:** Add SSL termination with a reverse proxy like Traefik or Nginx
4. **Monitoring:** Add monitoring and logging solutions
5. **Scaling:** Adjust resource limits based on expected load