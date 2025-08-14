const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coinsage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateUsers() {
  try {
    console.log('Starting user migration...');
    
    // Find all users that have old field names but not new ones
    const usersToMigrate = await User.find({
      $or: [
        { firstName: { $exists: true }, first_name: { $exists: false } },
        { lastName: { $exists: true }, last_name: { $exists: false } }
      ]
    });

    console.log(`Found ${usersToMigrate.length} users to migrate`);

    for (const user of usersToMigrate) {
      // Copy old field names to new field names
      if (user.firstName && !user.first_name) {
        user.first_name = user.firstName;
      }
      if (user.lastName && !user.last_name) {
        user.last_name = user.lastName;
      }
      
      await user.save();
      console.log(`Migrated user: ${user.username}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUsers(); 