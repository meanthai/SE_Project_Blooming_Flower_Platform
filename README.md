

# FlowerOrderPlatform

FlowerOrderPlatform is a full-stack web application designed to facilitate the ordering and management of flowers, with advanced search and chatbot capabilities. The platform is composed of multiple services, including a React-based frontend, two distinct backends (one in Python and one in TypeScript/Node.js), and a vector database for semantic search.

## Features

- **User Management:** Register, authenticate, and manage user profiles.
- **Order Management:** Place, track, and manage flower orders.
- **Restaurant/Shop Management:** Manage flower shops, menus, and delivery details.
- **AI Chatbot:** Python backend integrates with generative AI (Google Gemini) and semantic search (Qdrant) to answer flower-related queries and provide recommendations.
- **Semantic Search:** Uses embeddings and reranking models to retrieve and recommend relevant flower information.
- **Modern Frontend:** Built with React, TypeScript, and Vite for a fast, responsive user experience.
- **Containerized Deployment:** Docker Compose setup for easy local development and deployment, including all services and dependencies.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend (API):** Node.js, Express, MongoDB, Mongoose
- **Backend (AI/Chatbot):** Python, FastAPI (or Flask), Qdrant, Sentence Transformers, Google Gemini API
- **Database:** MongoDB (orders, users, shops), Qdrant (vector search)
- **DevOps:** Docker, Docker Compose

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd FlowerOrderPlatform
   ```

2. **Start all services using Docker Compose:**
   ```bash
   docker compose up -d
   ```

3. **Frontend:**
   - Navigate to the `frontend` directory and follow the instructions in its README to start the development server.

4. **Backend (TypeScript):**
   - Navigate to `backend-ts` and install dependencies:
     ```bash
     npm install
     npm run dev
     ```

5. **Backend (Python):**
   - Navigate to `backend-py` and install dependencies (see its README for details).

6. **Environment Variables:**
   - Configure `.env` files for each service as needed (API keys, database URIs, etc.).

## Project Structure

- `frontend/` — React web client
- `backend-ts/` — Node.js/Express API for orders, users, and shops
- `backend-py/` — Python backend for AI chatbot and semantic search
- `docker-compose.yaml` — Multi-service orchestration
- `qdrant/` — Vector database for semantic search

## License

This project is for educational and demonstration purposes.

---

Would you like this description added to your main README file, or do you want to customize any section?
