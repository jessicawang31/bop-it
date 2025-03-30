import express from 'express';
var router = express.Router();

import chatsRouter from './controllers/chats.js';
import usersRouter from './controllers/users.js'
import scoresRouter from './controllers/scores.js'

router.use('/chats', chatsRouter);
router.use('/users', usersRouter);
router.use('/scores', scoresRouter);

export default router;