const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createDemoUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coinsage', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@coinsage.com' });
    
    if (existingUser) {
      console.log('✅ Demo user already exists');
      console.log('📧 Email: demo@coinsage.com');
      console.log('🔑 Password: demo123456');
      process.exit(0);
    }

    // Create demo user
    const demoUser = new User({
      username: 'demo_user',
      email: 'demo@coinsage.com',
      password: 'demo123456',
      firstName: 'Demo',
      lastName: 'User'
    });

    await demoUser.save();

    console.log('✅ Demo user created successfully!');
    console.log('📧 Email: demo@coinsage.com');
    console.log('🔑 Password: demo123456');
    console.log('👤 Username: demo_user');

  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createDemoUser(); 