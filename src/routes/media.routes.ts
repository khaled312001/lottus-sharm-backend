import { Router } from 'express';
import multer from 'multer';
import { list, remove, updateMeta, upload } from '../controllers/media.controller';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();
router.use(requireAuth);

const memUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 250 * 1024 * 1024 },
});

router.get('/', asyncHandler(list));
router.post('/upload', memUpload.array('files', 20), asyncHandler(upload));
router.patch('/:id', asyncHandler(updateMeta));
router.delete('/:id', asyncHandler(remove));

export default router;
