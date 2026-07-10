# 🤖 AI Workspace

A production-ready AI Workspace built with **FastAPI**, **PostgreSQL**, and **Ollama**, featuring authentication, chat management, conversation history, automatic chat titles, streaming AI responses, and a modular architecture designed for future RAG and AI Agents.

---

# ✨ Features

## Authentication
- JWT Authentication
- User Registration
- Secure Password Hashing (bcrypt)
- OAuth2 Password Flow

## Chat Management
- Create Chat
- Rename Chat
- Delete Chat
- List User Chats

## AI Chat
- Conversation History
- Local LLM (Ollama)
- Automatic Chat Titles
- Streaming Responses
- Persistent Chat Storage

## Database
- PostgreSQL
- SQLAlchemy ORM
- Alembic Migrations

## Architecture
- Service Layer
- Provider Abstraction
- Clean Architecture
- Modular Design

---

# 🏗️ Project Architecture

```text
React Frontend
        │
        ▼
FastAPI API
        │
        ▼
Authentication
        │
        ▼
Message Service
        │
        ├───────────────┐
        ▼               ▼
 Conversation      Chat Service
        │
        ▼
LLM Service
        │
        ▼
Ollama
        │
        ▼
Llama 3.2
```

---

# 🛠️ Tech Stack

## Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- JWT Authentication
- OAuth2

## AI

- Ollama
- Llama 3.2
- Prompt Engineering
- Streaming LLM

## Database

- PostgreSQL
- SQLAlchemy ORM

---

# 📂 Project Structure

```text
backend/
│
├── alembic/
│
├── app/
│   ├── agents/
│   ├── api/
│   ├── auth/
│   ├── automation/
│   ├── core/
│   ├── database/
│   ├── enums/
│   ├── llm/
│   ├── models/
│   ├── rag/
│   ├── schemas/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   └── main.py
│
├── .env
├── .gitignore
├── alembic.ini
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone <https://github.com/shivam15singhal/AI-Workspace>
cd backend
```

## Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Configure Environment

Create a `.env` file.

```env
DATABASE_URL=postgresql://...
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Run Server

```bash
uvicorn app.main:app --reload
```

Swagger:

```
http://127.0.0.1:8000/docs
```

---

# 📡 API Overview

## Authentication

- Register
- Login

## Chats

- Create Chat
- Get Chats
- Update Chat
- Delete Chat

## Messages

- Create Message
- Get Chat Messages
- Stream AI Response

---

# 🚀 Current Progress

- ✅ Authentication
- ✅ Chat CRUD
- ✅ Message CRUD
- ✅ Ollama Integration
- ✅ Automatic Chat Titles
- ✅ Streaming Responses

---

# 🛣️ Roadmap

- React Frontend
- Markdown Rendering
- PDF Upload
- RAG Pipeline
- Embeddings (bge-m3)
- pgvector
- Semantic Search
- AI Memory
- Tool Calling
- AI Agents
- Docker
- Deployment

---

# 📸 Screenshots

> Screenshots will be added after frontend development.

---

# 👨‍💻 Author

**Shivam Singhal**

AI Engineer | Full Stack Developer

---

# ⭐ If you like this project

Give it a ⭐ on GitHub.