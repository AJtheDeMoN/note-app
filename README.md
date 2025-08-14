## Full-Stack Notes Taking App
This is a modern, full-stack note-taking application built from the ground up as part of a developer assignment. The application features a secure backend API built with Python and a responsive, hand-crafted frontend using Next.js.

The project adheres to strict development constraints, including no pre-made UI component libraries, and a focus on clean, original, and well-documented code.

### **How to Install and Run Locally**
Follow these steps to get the application running on your local machine.

### 1. Prerequisites

Before you begin, ensure you have the following installed:

- **Docker & Docker Compose:** Required to build and run the containerized backend and database.

- **Node.js & npm/yarn:** Required to run the frontend development server locally.

### 2. Configure Environment Variables

The application uses environment variables to manage sensitive information like database connection strings and JWT secrets.

- In the root directory of the project, create a new file named .env.

- Copy the contents of the .env.example file below and paste them into your new .env file.
```
# .env.example

# Backend Configuration
MONGO_DETAILS="mongodb://mongo:27017"
JWT_SECRET_KEY="your_super_secret_key_of_at_least_32_chars"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Test User Credentials (for performance testing)
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="testpassword"
```

- In the frontend directory, create a file named .env.local and add the following line:
```
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
- Important: In your root .env file, replace ```"your_super_secret_key_of_at_least_32_chars"``` with a unique, randomly generated string. You can generate one easily by running ```python -c 'import secrets; print(secrets.token_hex(32))'``` in your terminal.

### 3. Run the Application
This application is run in two separate parts.

**Part A: Run the Backend and Database (with Docker)**

From the project's root directory, run the following command. This will start the FastAPI server and the MongoDB database.
```
docker-compose up --build
```
The backend API will be available at http://localhost:8000.

**Part B: Run the Frontend (with npm/yarn)**

Open a new terminal window, navigate to the frontend directory, and run:
```
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend application will be available at http://localhost:3000.

## Design Decisions & Trade-offs
This section outlines the key architectural and technological choices made during development.

### Backend (FastAPI & MongoDB)
- **Framework: FastAPI**

    - **Reasoning**: I chose FastAPI for its exceptional performance, which is comparable to Node.js and Go. Its modern Python features, including async/await and type hints (powered by Pydantic), lead to robust, clean, and less error-prone code. The automatic generation of interactive API documentation (/docs) was a significant advantage, drastically speeding up development and testing cycles.

- **Database: MongoDB (NoSQL)**

    - **Reasoning**: For a notes application, the structure of a "note" can be fluid. A NoSQL document database like MongoDB is a natural fit. It allows for a flexible schema, which is especially beneficial for features like a rich text editor where the content is stored as HTML or JSON. This avoids the rigidity of a traditional SQL database and simplifies development without complex migrations for content changes.

- **Authentication: JWT**

    - **Reasoning**: JSON Web Tokens (JWT) were chosen for managing authentication. JWTs are stateless, meaning the server does not need to store session information. This makes the API scalable and well-suited for a decoupled frontend. The token contains the user's identity, which is verified on every protected request.

### Frontend (Next.js & Zustand)
- **Framework: Next.js**

    - **Reasoning**: Next.js provides a powerful, production-ready React framework with features like file-based routing (App Router), server-side rendering, and built-in optimizations that are essential for a modern web application.

- **UI Components: Hand-Crafted with Tailwind CSS**

    - **Reasoning**: As per the assignment's restrictions, no pre-made UI libraries like Material-UI or Bootstrap were used. All components (buttons, inputs, modals) were built from scratch using Tailwind CSS. This approach provides complete control over the UI's look and feel and results in a highly optimized, lean final product without unused styles from a large library.

- **State Management: Zustand & React Query**

    - **Reasoning**: I chose a combination of two state management libraries for a clean separation of concerns.

        - **Zustand**: Used for simple, global client-side state, specifically for managing the user's authentication status and token. Its minimal API and small bundle size make it perfect for this use case without the boilerplate of Redux.

        - **React Query**: Used for managing all server state (API data). It expertly handles caching, background refetching, and loading/error states for API calls, which significantly simplifies the data-fetching logic in the components.

## Justification for External Libraries
While the core UI was hand-crafted, a few external libraries were used to implement the bonus features.

- **Tiptap (```@tiptap/react```)**

    - **Purpose**: To implement the Rich Text Editor.

    - **Justification**: Tiptap is a "headless" rich text editor library. This means it provides the logic for handling rich text but comes with no pre-built UI. This aligns with the spirit of the assignment's "no UI libraries" rule, as all styling and toolbar components were still hand-crafted using Tailwind CSS. It was chosen over other libraries for its modern, extensible architecture.

- **Locust (```locust```)**

    - **Purpose**: For backend performance testing.

    - **Justification**: Locust is a modern, Python-based load testing tool. It was chosen because it allows for defining user behavior with simple Python code, which perfectly matched the requirement to simulate a user logging in and then repeatedly fetching their notes.
