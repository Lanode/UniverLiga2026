# UniverLiga Backend

FastAPI backend with SQLAlchemy, JWT authentication, and CORS support.

## Features

- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: ORM for database operations
- **JWT Authentication**: Secure token-based authentication
- **CORS**: Cross-Origin Resource Sharing enabled for all origins
- **SQLite Database**: File-based database (can be upgraded to PostgreSQL)
- **Automatic API Documentation**: Interactive Swagger UI at `/docs`

## Project Structure

```
backend/
├── src/
│   ├── main.py              # Main FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # SQLAlchemy database setup
│   ├── models.py            # SQLAlchemy models (User, Item)
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # CRUD operations
│   ├── auth.py              # JWT authentication
│   └── routers/
│       ├── auth.py          # Authentication routes
│       ├── users.py         # User management routes
│       └── items.py         # Example CRUD routes
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get access token
- `GET /auth/me` - Get current user info
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users/` - List all users (superuser only)
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user (superuser only)

### Items
- `GET /items/` - List current user's items
- `POST /items/` - Create a new item
- `GET /items/{id}` - Get item by ID
- `PUT /items/{id}` - Update item
- `DELETE /items/{id}` - Delete item

## Setup Instructions

1. **Create virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env file with your settings
   ```

4. **Run the application**:
   ```bash
   cd src
   python main.py
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access the API**:
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=sqlite:///./app.db

# JWT
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# App
APP_NAME=UniverLiga Backend
DEBUG=True
```

## Database

The application uses SQLite by default. To use PostgreSQL, change the `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## Testing the API

1. Open http://localhost:8000/docs in your browser
2. Register a new user using `/auth/register`
3. Login using `/auth/login` to get an access token
4. Click "Authorize" button and enter: `Bearer <your-access-token>`
5. Test protected endpoints like `/auth/me`, `/items/`, etc.

## Integration with Frontend

The backend is configured with CORS to allow requests from:
- http://localhost:5173 (Vite default)
- http://localhost:3000 (Create React App default)

You can modify `ALLOWED_ORIGINS` in the `.env` file to add more origins.