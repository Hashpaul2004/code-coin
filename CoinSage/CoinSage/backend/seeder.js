const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');
const Chat = require('./models/Chat');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coinsage', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    await Chat.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Create demo user
    const demoUser = new User({
      username: 'demo_user',
      email: 'demo@coinsage.com',
      password: 'demo123456',
      firstName: 'Demo',
      lastName: 'User',
      profilePicture: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=DU',
      isActive: true,
      lastLogin: new Date()
    });

    await demoUser.save();
    console.log('✅ Demo user created');

    // Create demo transactions
    const transactions = [
      {
        user: demoUser._id,
        type: 'income',
        category: 'salary',
        amount: 5000,
        description: 'Monthly salary from TechCorp',
        date: new Date('2025-08-01'),
        tags: ['salary', 'monthly'],
        isRecurring: true,
        recurringInterval: 'monthly'
      },
      {
        user: demoUser._id,
        type: 'income',
        category: 'freelance',
        amount: 800,
        description: 'Freelance web development project',
        date: new Date('2025-07-28'),
        tags: ['freelance', 'web-dev'],
        isRecurring: false
      },
      {
        user: demoUser._id,
        type: 'expense',
        category: 'food',
        amount: 120,
        description: 'Grocery shopping for the week',
        date: new Date('2025-08-01'),
        tags: ['groceries', 'essential'],
        isRecurring: false
      },
      {
        user: demoUser._id,
        type: 'expense',
        category: 'transportation',
        amount: 60,
        description: 'Monthly bus pass',
        date: new Date('2025-08-01'),
        tags: ['transport', 'monthly'],
        isRecurring: true,
        recurringInterval: 'monthly'
      },
      {
        user: demoUser._id,
        type: 'expense',
        category: 'entertainment',
        amount: 45,
        description: 'Movie night with friends',
        date: new Date('2025-07-30'),
        tags: ['entertainment', 'social'],
        isRecurring: false
      },
      {
        user: demoUser._id,
        type: 'expense',
        category: 'bills',
        amount: 150,
        description: 'Electricity bill',
        date: new Date('2025-07-25'),
        tags: ['bills', 'utilities'],
        isRecurring: true,
        recurringInterval: 'monthly'
      },
      {
        user: demoUser._id,
        type: 'expense',
        category: 'shopping',
        amount: 200,
        description: 'New laptop accessories',
        date: new Date('2025-07-20'),
        tags: ['shopping', 'electronics'],
        isRecurring: false
      },
      {
        user: demoUser._id,
        type: 'income',
        category: 'investment',
        amount: 300,
        description: 'Dividend from stock portfolio',
        date: new Date('2025-07-15'),
        tags: ['investment', 'dividend'],
        isRecurring: true,
        recurringInterval: 'monthly'
      }
    ];

    await Transaction.insertMany(transactions);
    console.log('✅ Demo transactions created');

    // Create demo budgets
    const budgets = [
      {
        user: demoUser._id,
        name: 'Food & Dining',
        amount: 500,
        spent: 120,
        category: 'food',
        period: 'monthly',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-08-31'),
        isActive: true,
        notifications: true,
        alertThreshold: 80
      },
      {
        user: demoUser._id,
        name: 'Entertainment',
        amount: 200,
        spent: 45,
        category: 'entertainment',
        period: 'monthly',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-08-31'),
        isActive: true,
        notifications: true,
        alertThreshold: 75
      },
      {
        user: demoUser._id,
        name: 'Transportation',
        amount: 150,
        spent: 60,
        category: 'transportation',
        period: 'monthly',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-08-31'),
        isActive: true,
        notifications: true,
        alertThreshold: 80
      },
      {
        user: demoUser._id,
        name: 'Shopping',
        amount: 300,
        spent: 200,
        category: 'shopping',
        period: 'monthly',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-08-31'),
        isActive: true,
        notifications: true,
        alertThreshold: 70
      }
    ];

    await Budget.insertMany(budgets);
    console.log('✅ Demo budgets created');

    // Create demo chat
    const demoChat = new Chat({
      user: demoUser._id,
      title: 'Budget Planning Advice',
      messages: [
        {
          role: 'user',
          content: 'I want to save $1000 per month. How should I budget my $5000 monthly income?',
          timestamp: new Date('2025-08-01T10:00:00Z')
        },
        {
          role: 'assistant',
          content: 'Great goal! Here\'s a recommended 50/30/20 budget breakdown for your $5000 income:\n\n💰 **50% - Needs ($2500)**:\n- Rent/Mortgage: $1200\n- Utilities: $200\n- Food: $500\n- Transportation: $150\n- Insurance: $200\n- Other essentials: $250\n\n🎯 **30% - Wants ($1500)**:\n- Entertainment: $300\n- Shopping: $400\n- Dining out: $300\n- Hobbies: $300\n- Travel: $200\n\n💎 **20% - Savings ($1000)**:\n- Emergency fund: $400\n- Investment: $400\n- Specific goals: $200\n\nThis gives you exactly $1000 for savings while maintaining a balanced lifestyle!',
          timestamp: new Date('2025-08-01T10:01:00Z')
        },
        {
          role: 'user',
          content: 'What about investing? Should I start with stocks or mutual funds?',
          timestamp: new Date('2025-08-01T10:05:00Z')
        },
        {
          role: 'assistant',
          content: 'For beginners, I recommend starting with mutual funds or ETFs rather than individual stocks. Here\'s why:\n\n📈 **Mutual Funds/ETFs**:\n- Diversified (reduces risk)\n- Professional management\n- Lower minimum investment\n- Good for long-term goals\n\n🎯 **Recommended allocation**:\n- 60% S&P 500 index fund\n- 20% International fund\n- 20% Bond fund\n\n💡 **Start with**:\n- Vanguard Total Stock Market ETF (VTI)\n- Or a target-date retirement fund\n\n💰 **Monthly investment**: $400-500 from your budget\n\nRemember: Start small, be consistent, and focus on long-term growth!',
          timestamp: new Date('2025-08-01T10:06:00Z')
        }
      ],
      isActive: true,
      lastActivity: new Date('2025-08-01T10:06:00Z')
    });

    await demoChat.save();
    console.log('✅ Demo chat created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Demo Data Summary:');
    console.log('- 1 Demo User');
    console.log('- 8 Transactions (Income & Expenses)');
    console.log('- 4 Budget Categories');
    console.log('- 1 AI Chat Conversation');
    console.log('\n🔑 Login Credentials:');
    console.log('📧 Email: demo@coinsage.com');
    console.log('🔑 Password: demo123456');
    console.log('👤 Username: demo_user');

  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedDatabase(); 