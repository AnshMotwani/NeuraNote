# NeuraNote - A Notion Clone

A powerful note-taking application with markdown editing, graph visualization, and AI-powered features.

## 🚀 Features

### Core Features (MVP)
- ✅ User Authentication (JWT)
- ✅ Dashboard with page list/tree structure
- ✅ Markdown Editor (WYSIWYG + keyboard shortcuts)
- ✅ Save & edit notes in database
- ✅ Tagging + Filtering
- ✅ Linked Notes with `[[note-name]]` linking
- ✅ Graph View of notes using D3.js
- ✅ Search bar (basic title/content)

### Advanced Features (Phase 2)
- ✨ AI Note Summarization (OpenAI API)
- ✨ Page version history
- ✨ Custom blocks (image, checklist, code block, table)
- ✨ Drag-and-drop page organization
- ✨ Dark/Light theme toggle
- ✨ PWA Support for offline use
- ✨ Export/Import notes as Markdown or PDF

### Stretch Goals (Phase 3)
- 🚀 Real-time Collaboration (WebSockets)
- 🚀 AI-generated pages from prompts
- 🚀 Public pages with shareable URLs
- 🚀 Mobile app (React Native)

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT
- **AI**: OpenAI API

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Editor**: TipTap (rich text editor)
- **Graph Visualization**: D3.js
- **UI Components**: Radix UI

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway/Render
- **Database**: Supabase/PostgreSQL

## 📁 Project Structure

```
NeuraNote/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core config
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── requirements.txt
│   └── main.py
├── frontend/               # Next.js frontend
│   ├── app/               # App router
│   ├── components/        # React components
│   ├── lib/              # Utilities
│   ├── store/            # Zustand store
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL
- OpenAI API key (for AI features)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost/neuranote
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-key
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 Development Roadmap

### Phase 1 (MVP) - Current
- [x] Project setup
- [ ] User authentication
- [ ] Basic CRUD for notes
- [ ] Markdown editor
- [ ] Graph visualization
- [ ] Search functionality

### Phase 2 (Advanced)
- [ ] AI summarization
- [ ] Version history
- [ ] Custom blocks
- [ ] Theme toggle
- [ ] PWA support

### Phase 3 (Collaboration)
- [ ] Real-time editing
- [ ] AI page generation
- [ ] Public sharing
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 