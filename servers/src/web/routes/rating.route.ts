import { Router } from 'express';
import { RatingApi } from '@/web/api/rating.api';
import { authenticate } from '@/web/middlewares/auth.middleware';

const router = Router();
const ratingApi = new RatingApi();

// Public routes
router.get('/', ratingApi.getAllRatings);
router.get('/:id', ratingApi.getRatingById);

// Protected routes
router.use(authenticate);
router.get('/user/my', ratingApi.getMyRatings);
router.post('/', ratingApi.createRating);
router.put('/:id', ratingApi.updateRating);
router.delete('/:id', ratingApi.deleteRating);

export default router;


