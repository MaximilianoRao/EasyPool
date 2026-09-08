import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface RequestConUsuario extends Request {
  usuario?: { id: number; rol: string };
}

export function verificarToken(req: RequestConUsuario, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1]; // el header viene como "Bearer <token>"

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.usuario = payload as { id: number; rol: string };
    next(); // el token es válido, dejamos seguir el pedido
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}