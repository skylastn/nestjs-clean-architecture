import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/auth_service';

// Logging, Rate Limit
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private user: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  }
}
