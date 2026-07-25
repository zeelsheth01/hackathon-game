export const authMiddleware = (req: any, res: any, next: any) => {
  // Extract userId from body or headers:
  const userId = req.headers['x-user-id'] || req.body.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: missing user ID' });
  }
  req.userId = userId;
  req.accessToken = req.headers['x-access-token'];
  next();
};
