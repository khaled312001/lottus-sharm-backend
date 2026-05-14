import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { translate } from '../services/translate.service';

const router = Router();
router.use(requireAuth);

const schema = z.object({
  text: z.string().min(1).max(20000),
  from: z.enum(['AR', 'EN', 'RU', 'IT']),
  to: z.array(z.enum(['AR', 'EN', 'RU', 'IT'])).min(1),
  context: z.string().optional(),
});

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = schema.parse(req.body);
    const result = await translate(body);
    res.json({ ok: true, data: result });
  }),
);

export default router;
