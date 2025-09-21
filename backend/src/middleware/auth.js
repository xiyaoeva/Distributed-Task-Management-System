
import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req,res,next){
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if(!token) return res.status(401).json({error:'missing token'});
  try{
    const payload = verifyToken(token);
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({error:'invalid token'});
  }
}

export function requireRole(role){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).json({error:'unauthorized'});
    if(req.user.role !== role) return res.status(403).json({error:'forbidden'});
    next();
  };
}
