import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  console.log('=== Incoming auth headers:', req.headers.authorization);
  const token = req.headers.authorization?.split(' ')[1];

  console.log('=== Extracted token:', token);
  console.log('=== JWT_SECRET for verification:', process.env.JWT_SECRET);

  if (!token) {
    console.log('=== No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('=== Token verified successfully:', decoded);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.error('=== Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token', details: error.message });
  }
};

export default verifyToken;
