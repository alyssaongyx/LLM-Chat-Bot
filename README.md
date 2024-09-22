# LLM Chat Bot

This project is a chat bot application that uses Large Language Models (LLMs) to generate responses. It consists of a FastAPI backend and a Next.js frontend.

## Features

- Create and manage conversations
- Send prompts to the LLM and receive responses
- View conversation history
- Anonymized storage of prompts and responses

## Tech Stack

- Backend: FastAPI, MongoDB (with Beanie ODM)
- Frontend: Next.js, React Query, Mantine UI, Node, React.js
- LLM Integration: OpenAI API

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- MongoDB

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/llm-chat-bot.git
   cd llm-chat-bot
   ```

2. Set up the backend:

   ```
   cd llm-backend
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

3. Set up the frontend:

   ```
   cd ../llm-chat-frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `llm-backend` directory with the following content:
     ```
     OPENAI_API_KEY=your_openai_api_key
     MONGODB_URL=your_mongodb_url
     ```
   - Create a `.env` file in the `llm-chat-frontend` directory with the following content:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000/api
     ```

### Running the Application

1. Start the backend server:

   ```
   cd llm-backend
   uvicorn app.main:app --reload
   ```

2. Start the frontend development server:

   ```
   cd llm-chat-frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to use the application.

## Docker

1. Build and run the Docker containers:
   ```
   docker-compose up --build
   ```
2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Why I used /api

The addition of the /api prefix in the backend routes serves several purposes:

1. Versioning and organization: It allows for easier versioning of the API and provides a clear separation between API routes and other potential routes in the application.
2. Security: It can help in implementing security measures specifically for API routes.
3. Routing and middleware: It makes it easier to apply specific middleware or routing logic to all API routes.
4. Consistency: It provides a consistent structure for all API endpoints.
