# Coinsage Backend

A Node.js Express backend for the Coinsage financial management application with AI-powered chat functionality.

## Features

- 🔐 **Authentication**: JWT-based user authentication
- 💰 **Financial Management**: Transaction tracking and budget management
- 🤖 **AI Chat**: OpenAI-powered financial advisor
- 📊 **Analytics**: Financial summaries and insights
- 🔒 **Security**: Rate limiting, CORS, and input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **AI**: OpenAI GPT-3.5-turbo
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment variables**:
   Create a `.env` file with:
   ```
   NODE_ENV=development
   PORT=8000
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   MONGODB_URI=mongodb://localhost:27017/coinsage
   OPENAI_API_KEY=your-openai-api-key-here
   ```

3. **Database**: Make sure MongoDB is running locally or update MONGODB_URI

4. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Financial
- `GET /api/financial/transactions` - Get user transactions
- `POST /api/financial/transactions` - Create transaction
- `PUT /api/financial/transactions/:id` - Update transaction
- `DELETE /api/financial/transactions/:id` - Delete transaction
- `GET /api/financial/summary` - Get financial summary
- `GET /api/financial/budgets` - Get user budgets
- `POST /api/financial/budgets` - Create budget

### Chat
- `GET /api/chat` - Get user chats
- `POST /api/chat` - Create new chat
- `GET /api/chat/:id` - Get chat messages
- `POST /api/chat/:id/messages` - Send message (AI response)
- `DELETE /api/chat/:id` - Delete chat

### Agents
- `GET /api/agents/status` - Get AI agents status
- `POST /api/agents/process` - Process AI agent request

### Health
- `GET /health` - Health check endpoint

## Database Models

- **User**: User authentication and profile data
- **Transaction**: Financial transactions (income/expense)
- **Budget**: Budget management and tracking
- **Chat**: AI chat conversations

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

## Development

The server runs on `http://localhost:8000` by default.

For development with auto-restart:
```bash
npm run dev
``` 