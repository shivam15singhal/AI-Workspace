# AI Workspace

AI Workspace is a full-stack AI application that combines conversational AI, document-based question answering (RAG), workspace management, and AI-powered automations into a single platform.

The goal of this project was to build an intelligent workspace where users can organize chats, upload documents, retrieve information using AI, and automate daily workflows such as email and calendar management.

---

## Features

### 🤖 AI Chat

- Real-time streaming AI responses
- Edit previously sent prompts
- Regenerate AI responses
- Retry failed responses
- Stop response generation while streaming
- Markdown rendering
- Syntax highlighting for code blocks
- Multiple model support (Gemini / Ollama)

---

### 📄 RAG (Retrieval-Augmented Generation)

Upload documents and ask questions about their contents.

The application:

- Uploads documents
- Processes and chunks text
- Generates embeddings
- Stores embeddings in ChromaDB
- Retrieves relevant context
- Generates AI responses based on uploaded knowledge

---

### 📁 Workspace Management

Organize your work into multiple workspaces.

Each workspace has its own:

- Chats
- Documents
- AI context

Features include:

- Create workspace
- Rename workspace
- Delete workspace
- Switch between workspaces

---

### 💬 Chat Management

- Create chats
- Rename chats
- Delete chats
- Persistent conversation history

---

### 📚 Document Management

- Upload documents
- Upload progress indicator
- Processing status
- Automatic polling until processing completes
- Workspace documents
- Chat-specific documents
- Search documents
- Sort documents
- Delete documents

---

### ⚡ AI Automations

The application includes AI-powered automations that can perform tasks using connected services.

Current automation capabilities include:

- 📧 Email automation
  - Read emails
  - Search emails
  - Draft email responses

- 📅 Google Calendar automation
  - Read upcoming events
  - Schedule meetings
  - Delete events
  - View calendar availability

These automations are available directly through the AI assistant using integrated tools.

---

### 🔗 Google Calendar Integration

Users can connect their Google account to:

- View upcoming calendar events
- Refresh events
- Delete events
- Disconnect Google Calendar

---

### 🎨 User Experience

- Dark / Light theme
- Responsive UI
- Toast notifications
- Loading states
- Skeleton loaders
- Empty states
- Markdown support
- Code syntax highlighting

---

# Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router
- Axios
- Framer Motion
- Sonner
- React Markdown
- Highlight.js

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Google OAuth
- Pydantic

## AI

- Google Gemini
- Ollama
- LangChain
- ChromaDB
- Retrieval-Augmented Generation (RAG)

---

# Project Structure

```
frontend/
├── api/
├── components/
├── pages/
├── services/
├── store/
├── types/
└── utils/

backend/
├── api/
├── models/
├── schemas/
├── services/
├── tools/
├── vectorstore/
└── core/
```

---

# How It Works

1. User creates or selects a workspace.
2. Documents can be uploaded to the workspace or an individual chat.
3. Documents are processed and stored in the vector database.
4. When a question is asked, relevant document chunks are retrieved.
5. The retrieved context is sent to the language model.
6. Responses are streamed back to the user in real time.

---

# Authentication

- JWT Authentication
- Protected Routes
- Google OAuth Integration

---

# State Management

Global application state is managed using **Zustand**.

Stores include:

- Authentication
- Chats
- Workspaces
- Documents
- Model Selection

---

# Installation

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

# Environment Variables

## Frontend

```env
VITE_API_URL=
```

## Backend

```env
DATABASE_URL=
SECRET_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GEMINI_API_KEY=

OLLAMA_BASE_URL=
```

---


## Author

**Shivam Singhal**

Built as a full-stack AI application to explore conversational AI, Retrieval-Augmented Generation, document intelligence, and AI-powered workflow automation.