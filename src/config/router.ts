import { Router } from 'express';

import userAPIRouter from '../controllers/UserController';
import { Request, Response, NextFunction } from 'express';

const router: Router = Router();

router.use('/api/user', userAPIRouter);

/**
 * Health Check
 */
router.use('/api/health', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('OK');
});
export default router;
