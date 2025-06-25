# Getting Started with NeuraNote

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL database
- OpenAI API key (optional, for AI features)

### 1. Database Setup

First, create a PostgreSQL database:

```sql
CREATE DATABASE neuranote;
CREATE USER neuranote_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE neuranote TO neuranote_user;
```

### 2. Environment Configuration

Update the environment files with your credentials:

**Backend (.env)**
```bash
cd backend
# Edit .env file with your database credentials
DATABASE_URL=postgresql://neuranote_user:your_password@localhost/neuranote
SECRET_KEY=your-super-secret-key-change-this
OPENAI_API_KEY=your-openai-key-optional
```

**Frontend (.env.local)**
```bash
cd frontend
# Edit .env.local file
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start the Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

The API will be available at: http://localhost:8000
API documentation: http://localhost:8000/docs

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

The application will be available at: http://localhost:3000

### 5. Create Your First Account

1. Open http://localhost:3000
2. Click "Register" tab
3. Fill in your details and create an account
4. You'll be automatically logged in

## 🛠️ Development

### Backend Development

The backend is built with FastAPI and includes:

- **Authentication**: JWT-based auth with user registration/login
- **Notes API**: Full CRUD operations for notes
- **Search**: Full-text search across notes
- **Tags**: Note tagging system
- **Database**: PostgreSQL with SQLAlchemy ORM

Key endpoints:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/notes/` - List notes
- `POST /api/v1/notes/` - Create note
- `PUT /api/v1/notes/{id}` - Update note
- `DELETE /api/v1/notes/{id}` - Delete note
- `GET /api/v1/notes/search/?q=query` - Search notes

### Frontend Development

The frontend is built with Next.js 14 and includes:

- **Authentication**: Login/register forms with JWT
- **Dashboard**: Main application interface
- **Note Editor**: Rich text editor with TipTap
- **Graph View**: D3.js visualization of note relationships
- **Sidebar**: Note navigation and management
- **Responsive Design**: Works on desktop and mobile

Key features:
- Real-time note editing
- Markdown support with rich formatting
- Note linking with `[[note-name]]` syntax
- Graph visualization of note relationships
- Search functionality
- Tag management

## 📁 Project Structure

```
NeuraNote/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   └── v1/
│   │   │       ├── auth.py # Authentication endpoints
│   │   │       └── notes.py # Notes endpoints
│   │   ├── core/           # Core configuration
│   │   │   ├── config.py   # Settings
│   │   │   ├── database.py # Database setup
│   │   │   └── security.py # JWT utilities
│   │   ├── models/         # Database models
│   │   │   ├── user.py     # User model
│   │   │   └── note.py     # Note and Tag models
│   │   └── schemas/        # Pydantic schemas
│   ├── requirements.txt    # Python dependencies
│   └── main.py            # FastAPI app
├── frontend/               # Next.js frontend
│   ├── app/               # App router
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main page
│   ├── components/        # React components
│   │   ├── ui/           # UI components
│   │   ├── Dashboard.tsx # Main dashboard
│   │   ├── Sidebar.tsx   # Note sidebar
│   │   ├── NoteEditor.tsx # Rich text editor
│   │   ├── GraphView.tsx # D3.js graph
│   │   └── LoginForm.tsx # Auth forms
│   ├── lib/              # Utilities
│   │   ├── api.ts        # API client
│   │   └── utils.ts      # Utility functions
│   ├── store/            # State management
│   │   └── auth.ts       # Auth store (Zustand)
│   └── package.json      # Node dependencies
└── README.md             # Project overview
```

## 🔧 Configuration

### Backend Configuration

Key settings in `backend/.env`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/neuranote

# JWT
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI (optional)
OPENAI_API_KEY=your-openai-key

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend Configuration

Key settings in `frontend/.env.local`:

```bash
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to:
- **Railway**: Easy deployment with PostgreSQL
- **Render**: Free tier available
- **Fly.io**: Global deployment
- **Heroku**: Traditional deployment

### Frontend Deployment

The frontend can be deployed to:
- **Vercel**: Recommended for Next.js
- **Netlify**: Alternative option
- **Railway**: Full-stack deployment

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **CORS Errors**
   - Check `BACKEND_CORS_ORIGINS` in backend `.env`
   - Ensure frontend URL is included

3. **JWT Token Issues**
   - Check `SECRET_KEY` is set
   - Verify token expiration settings

4. **Frontend Build Errors**
   - Run `npm install` in frontend directory
   - Check Node.js version (18+ required)

### Development Tips

1. **Backend Development**
   - Use `uvicorn main:app --reload` for auto-reload
   - Check API docs at http://localhost:8000/docs
   - Use FastAPI's built-in validation

2. **Frontend Development**
   - Use `npm run dev` for development server
   - Check browser console for errors
   - Use React DevTools for debugging

3. **Database Development**
   - Use Alembic for migrations (future enhancement)
   - Check SQLAlchemy logs for queries
   - Use pgAdmin for database management

## 📚 API Documentation

Once the backend is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 