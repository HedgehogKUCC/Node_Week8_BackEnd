import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  // #swagger.ignore = true
  res.render('index', { title: 'Express' });
});

export default router;
