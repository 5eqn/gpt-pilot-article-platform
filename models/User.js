const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const existingUsers = await mongoose.model('User').countDocuments();
    if (existingUsers === 0) {
      user.isAdmin = true;
    }

    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return next(err);
      }
      user.password = hash;
      next();
    });
  } catch (error) {
    console.error('Error checking existing users:', error);
    console.error(error.stack);
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;