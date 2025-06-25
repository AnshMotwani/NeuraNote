#!/bin/bash

echo "🚀 Setting up NeuraNote..."

# Create environment files
echo "📝 Creating environment files..."

# Backend .env
cat > backend/.env << EOF
DATABASE_URL=postgresql://user:password@localhost/neuranote
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=your-openai-api-key
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]
APP_NAME=NeuraNote
VERSION=1.0.0
DEBUG=true
EOF

# Frontend .env.local
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

# Install backend dependencies
echo "🐍 Installing Python dependencies..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up PostgreSQL database"
echo "2. Update backend/.env with your database credentials"
echo "3. Start the backend: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "4. Start the frontend: cd frontend && npm run dev"
echo "5. Open http://localhost:3000 in your browser" 