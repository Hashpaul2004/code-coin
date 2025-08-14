const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coinsage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixUsers() {
  try {
    console.log('Starting user fix...');
    
    // Find all users that don't have is_active field set
    const usersToFix = await User.find({
      $or: [
        { is_active: { $exists: false } },
        { is_active: null }
      ]
    });

    console.log(`Found ${usersToFix.length} users to fix`);

    for (const user of usersToFix) {
      // Set is_active to true for existing users
      user.is_active = true;
      await user.save();
      console.log(`Fixed user: ${user.username}`);
    }

    console.log('User fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('User fix failed:', error);
    process.exit(1);
  }
}

fixUsers(); 