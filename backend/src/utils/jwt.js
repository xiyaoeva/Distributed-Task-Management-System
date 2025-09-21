
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
