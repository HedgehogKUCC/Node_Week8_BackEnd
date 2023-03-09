import { Router } from 'express';

import usersRouter from './v1/users';
import postsRouter from './v1/posts';
import uploadRouter from './v1/upload';

const router = Router();

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/upload', uploadRouter);

export default router;
