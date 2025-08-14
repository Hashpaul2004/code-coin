# CoinSage Setup Guide

This guide will help you set up and run the CoinSage AI-powered personal finance advisor application.

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager

## Backend Setup (Django)

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Create a virtual environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up environment variables
Create a `.env` file in the backend directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here-change-this-in-production
OPENAI_API_KEY=demo-api-key-for-development
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 5. Run database migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create a superuser (optional)
```bash
python manage.py createsuperuser
```

### 7. Initialize sample data
```bash
python setup.py
```

This will create:
- Sample categories (income and expense)
- Demo user (username: `demo_user`, password: `demo123`)
- Sample transactions, budgets, and financial goals
- User profile with financial preferences

### 8. Start the Django development server
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

## Frontend Setup (React)

### 1. Navigate to the frontend directory
```bash
cd frontend
```

### 2. Install Node.js dependencies
```bash
npm install
```

### 3. Start the React development server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Usage

### Demo Account
After running the setup script, you can log in with:
- **Username**: `demo_user`
- **Password**: `demo123`

### Features Available

1. **Dashboard**: Overview of financial data with charts and summaries
2. **AI Chat**: Interactive AI financial advisor with multi-agent system
3. **Transactions**: Track income and expenses (placeholder)
4. **Budgets**: Set and monitor budgets (placeholder)
5. **Goals**: Set financial goals and track progress (placeholder)
6. **Profile**: Manage user profile and preferences (placeholder)

### AI Features

The AI system includes:
- **Multi-agent architecture** with specialized agents
- **Life event simulation** for financial planning
- **Personalized advice** based on user's financial profile
- **Feedback system** for continuous improvement
- **Chat history** for context-aware conversations

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### User Management
- `GET /api/dashboard/` - User dashboard data
- `GET /api/profile/` - User profile
- `PATCH /api/profile/` - Update profile

### Chat & AI
- `POST /api/chat/` - Send message to AI
- `GET /api/chat/history/<session_id>/` - Get chat history
- `POST /api/chat/feedback/` - Submit feedback
- `POST /api/simulation/` - Run life event simulation

### Financial Data
- `GET /financial/transactions/` - Get transactions
- `POST /financial/transactions/` - Create transaction
- `GET /financial/budgets/` - Get budgets
- `POST /financial/budgets/` - Create budget
- `GET /financial/goals/` - Get financial goals
- `POST /financial/goals/` - Create financial goal
- `GET /financial/accounts/` - Get accounts
- `POST /financial/accounts/` - Create account

## Development

### Backend Development
- The Django backend uses Django REST Framework for APIs
- AI functionality is implemented in `agents/services.py`
- Database models are in `api/models.py` and `financial/models.py`
- Admin interface is available at `http://localhost:8000/admin/`

### Frontend Development
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- React Hot Toast for notifications

### AI Integration
- Uses OpenAI API (demo key for development)
- Multi-agent system with specialized agents
- Fallback responses when API is unavailable
- Context-aware conversations with user history

## Production Deployment

### Environment Variables
For production, update the `.env` file:
```env
DEBUG=False
SECRET_KEY=your-secure-secret-key
OPENAI_API_KEY=your-actual-openai-api-key
ALLOWED_HOSTS=your-domain.com
```

### Database
- Consider using PostgreSQL for production
- Update `DATABASES` setting in `settings.py`

### Static Files
```bash
python manage.py collectstatic
```

### Security
- Use HTTPS in production
- Set up proper CORS settings
- Implement rate limiting
- Use environment variables for sensitive data

## Troubleshooting

### Common Issues

1. **Database errors**: Run `python manage.py migrate`
2. **Module not found**: Ensure virtual environment is activated
3. **CORS errors**: Check CORS settings in `settings.py`
4. **API connection errors**: Verify backend server is running
5. **AI not responding**: Check OpenAI API key and network connection

### Logs
- Django logs: Check console output
- React logs: Check browser console
- API errors: Check Django admin interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the code documentation
3. Create an issue on the repository

---

**Note**: This is a prototype/demo application. For production use, implement proper security measures, error handling, and testing. 