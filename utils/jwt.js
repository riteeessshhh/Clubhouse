import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
