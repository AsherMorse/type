import { Router } from 'express';
import { formatContent } from './ai.controller';

const router = Router();
router.post('/format', formatContent);
export default router; 