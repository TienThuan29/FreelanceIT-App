import { Router } from 'express';
import { ProductApi } from '@/web/api/product.api';
import { authenticate, authorize } from '@/web/middlewares/auth.middleware';
import { uploadProductImage, uploadProductImages } from '@/web/middlewares/multer.middleware';

const router = Router();
const productApi = new ProductApi();

// Public routes (no authentication required)
router.get('/public/active', productApi.getActiveProducts);
router.get('/public/:id', productApi.getProductById);
router.post('/public/:id/view', productApi.incrementViews);

// Protected routes - require authentication
router.use(authenticate);

// Developer-only routes - require DEVELOPER role
router.post('/', authorize(['DEVELOPER']), productApi.createProduct);
router.get('/my-products', authorize(['DEVELOPER']), productApi.getMyProducts);
router.get('/limit-info', authorize(['DEVELOPER']), productApi.getProductLimitInfo);
router.get('/can-add', authorize(['DEVELOPER']), productApi.checkCanAddProduct);
router.put('/:id', authorize(['DEVELOPER']), productApi.updateProduct);
router.delete('/:id', authorize(['DEVELOPER']), productApi.deleteProduct);

// Image upload routes
router.post('/upload-image', authorize(['DEVELOPER']), uploadProductImage, productApi.uploadProductImage);
router.post('/upload-images', authorize(['DEVELOPER']), uploadProductImages, productApi.uploadProductImages);

// Admin routes - get all products
router.get('/', authorize(['ADMIN', 'DEVELOPER']), productApi.getAllProducts);
router.get('/:id', authorize(['ADMIN', 'DEVELOPER']), productApi.getProductById);

export default router;

