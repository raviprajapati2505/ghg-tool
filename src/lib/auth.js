import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || '2025-06-04-GORD-DEV-GHG-TOKEN';

export function signJWT(payload, expiresIn = '3d') {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyJWT(token) {
  try {
    // const decoded = jwt.decode(token);
    const decoded = jwt.verify(token, SECRET);
    if (decoded?.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (now > decoded.exp) {
        return null;
      }
    }

    return decoded;
  } catch (e) {
    console.error("JWT verification error:", e.message);
    return null;
  }
}