import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { hashedPassword, comparePassword } from '../utils/passwordUtils.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email }, { writeConcern: { w: 'majority' }});
    if (existingUser) {
      return res.render('signup', {
        message: 'User already exists',
        messageType: 'error',
      });
    }

    // Hash password and create new user
    const hashPass = await hashedPassword(password);
    const newUser = new User({ fullName, email, password: hashPass });
    await newUser.save();

    // Generate token and send it as cookie
    const token = generateToken(newUser);
    res.cookie('token', token, { httpOnly: true });

    // Redirect to login page with success message
    res.redirect('/');
  } catch (err) {
    console.error('Signup Error:', err);
    res.render('signup', {
      message: 'Server error, please try again later.',
      messageType: 'error',
    });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Render login with error message if email doesn't exist
      return res.render('login', {
        message: 'Invalid email or password',
        messageType: 'error',
      });
    }

    // Validate the password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      // Render login with error message if password is incorrect
      return res.render('login', {
        message: 'Invalid email or password',
        messageType: 'error',
      });
    }

    // Generate a token for the user
    const token = generateToken(user);

    // Send the token in a cookie
    res.cookie('token', token, { httpOnly: true });

    // Redirect user based on their role
    if (user.isAdmin) {
      // If user is an admin, redirect to admin view
      return res.redirect('/api/admin/view');
    } else if (user.isMember) {
      // If user is a member, redirect to member view
      return res.redirect('/api/member/view');
    } else {
      // If user is a normal user (not a member or admin), redirect to messages view
      return res.redirect('/api/messages');
    }

  } catch (err) {
    console.error('Login Error:', err);
    
    res.render('login', {
      message: 'Server error, please try again later.',
      messageType: 'error',
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token');

    
    res.redirect('/'); 
  } catch (err) {
    console.error('Logout Error:', err);
    res.render('error', {
      message: 'Server error during logout. Please try again later.',
      messageType: 'error',
    });
  }
};
