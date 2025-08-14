# CoinSage - AI-Powered Personal Finance Advisor

## Project Overview

CoinSage is a smart, adaptive, AI-powered personal finance advisor built on a novel agentic AI architecture. It provides comprehensive financial tracking, goal-oriented planning, and personalized financial advice through a multi-agent system.

## Key Features

- **Comprehensive Financial Tracking**: Monitor income, categorize expenses, and manage budgets
- **Goal-Oriented Planning**: Set, track, and adjust financial goals with hybrid agents
- **Agentic AI Design**: Multi-agent system (Planner, Trust Evaluator, Simulator, Recommender)
- **Life-Event Simulation Engine**: Stress-test financial advice against dynamic life scenarios
- **Persistent User Memory Layer**: Long-term user profile for personalized advice
- **Human-in-the-Loop Feedback**: User-driven feedback mechanism for enhanced trust and accuracy

## Tech Stack

### Backend
- Django 4.2+
- Django REST Framework
- SQLite (for development)
- OpenAI API (for AI features)

### Frontend
- React 18+
- TypeScript
- Tailwind CSS
- React Router
- Axios

## Project Structure

```
coinsage/
├── backend/                 # Django backend
│   ├── coinsage/           # Main Django project
│   ├── api/                # REST API endpoints
│   ├── agents/             # AI agent modules
│   ├── financial/          # Financial tracking models
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── package.json        # Node dependencies
└── README.md
```

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Environment Variables

Create a `.env` file in the backend directory:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
```

## API Endpoints

- `GET /api/financial/transactions/` - Get user transactions
- `POST /api/financial/transactions/` - Create new transaction
- `GET /api/financial/goals/` - Get user financial goals
- `POST /api/financial/goals/` - Create new financial goal
- `POST /api/chat/` - Chat with AI advisor
- `POST /api/simulate/` - Run life event simulation

## Features Implemented

- ✅ User authentication and registration
- ✅ Financial transaction tracking
- ✅ Budget management
- ✅ Financial goal setting and tracking
- ✅ AI-powered financial advice
- ✅ Life event simulation
- ✅ User feedback system
- ✅ Responsive dashboard
- ✅ Real-time chat interface

## Demo API Key

For demonstration purposes, the application uses a demo API key. In production, you would need to obtain a valid OpenAI API key.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License 