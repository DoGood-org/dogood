const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedUsers = async () => {
  await User.deleteMany({});
  await User.create([
    { name: 'Alice', email: 'alice@example.com', password: '123456' },
    { name: 'Bob', email: 'bob@example.com', password: '123456' }
  ]);
  console.log("Database seeded!");
  mongoose.disconnect();
};

seedUsers();
