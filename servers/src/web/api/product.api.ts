import { Request, Response } from 'express';
import { ProductService } from '@/services/product.service';
import { AuthService } from '@/services/auth.service';
import { ResponseUtil } from '@/libs/response';
import logger from '@/libs/logger';
import { ProductStatus } from '@/models/product.model';
import { s3RepositoryInstance } from '@/repositories/s3.repo';

export class ProductApi {
    private readonly productService: ProductService;
    private readonly authService: AuthService;

    constructor() {
        this.productService = new ProductService();
        this.authService = new AuthService();
        this.createProduct = this.createProduct.bind(this);
        this.getProductById = this.getProductById.bind(this);
        this.getMyProducts = this.getMyProducts.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.getAllProducts = this.getAllProducts.bind(this);
        this.getActiveProducts = this.getActiveProducts.bind(this);
        this.getProductLimitInfo = this.getProductLimitInfo.bind(this);
        this.incrementViews = this.incrementViews.bind(this);
        this.checkCanAddProduct = this.checkCanAddProduct.bind(this);
    }

    /**
     * Create a new product
     * POST /api/v1/products
     */
    public async createProduct(request: Request, response: Response): Promise<void> {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }

            const {
                title,
                description,
                category,
                price,
                images,
                techStack,
                status
            } = request.body;

            // Validate required fields
            if (!title || !description || !category || price === undefined) {
                ResponseUtil.error(response, 'Missing required fields: title, description, category, price', 400);
                return;
            }

            // Validate price
            if (price < 0) {
                ResponseUtil.error(response, 'Price must be a positive number', 400);
                return;
            }

            const productData = {
                developerId: currentUser.id,
                title,
                description,
                category,
                price,
                images: images || [],
                techStack: techStack || [],
                status: status || ProductStatus.DRAFT
            };

            const product = await this.productService.createProduct(productData, currentUser.id);

            if (!product) {
                ResponseUtil.error(response, 'Failed to create product', 500);
                return;
            }

            ResponseUtil.success(response, product, 'Product created successfully');
        } catch (error: any) {
            logger.error('Error creating product:', error);
            // Check if it's a planning limit error
            if (error.message && error.message.includes('maximum number of products')) {
                ResponseUtil.error(response, error.message, 403);
            } else {
                ResponseUtil.error(response, 'Failed to create product', 500);
            }
        }
    }

    /**
     * Get product by ID
     * GET /api/v1/products/:id
     */
    public async getProductById(request: Request, response: Response): Promise<void> {
        try {
            const { id } = request.params;

            if (!id) {
                ResponseUtil.error(response, 'Product ID is required', 400);
                return;
            }

            const product = await this.productService.getProductById(id);

            if (!product) {
                ResponseUtil.error(response, 'Product not found', 404);
                return;
            }

            ResponseUtil.success(response, product, 'Product retrieved successfully');
        } catch (error) {
            logger.error('Error getting product by ID:', error);
            ResponseUtil.error(response, 'Failed to get product', 500);
        }
    }

    /**
     * Get all products for the authenticated developer
     * GET /api/v1/products/my-products
     */
    public async getMyProducts(request: Request, response: Response): Promise<void> {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }

            const products = await this.productService.getProductsByDeveloperId(currentUser.id);
            ResponseUtil.success(response, products, 'Products retrieved successfully');
        } catch (error) {
            logger.error('Error getting developer products:', error);
            ResponseUtil.error(response, 'Failed to get products', 500);
        }
    }

    /**
     * Update product
     * PUT /api/v1/products/:id
     */
    public async updateProduct(request: Request, response: Response): Promise<void> {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }

            const { id } = request.params;
            if (!id) {
                ResponseUtil.error(response, 'Product ID is required', 400);
                return;
            }

            const {
                title,
                description,
                category,
                price,
                images,
                techStack,
                status
            } = request.body;

            const updateData: any = {};
            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (category !== undefined) updateData.category = category;
            if (price !== undefined) {
                if (price < 0) {
                    ResponseUtil.error(response, 'Price must be a positive number', 400);
                    return;
                }
                updateData.price = price;
            }
            if (images !== undefined) updateData.images = images;
            if (techStack !== undefined) updateData.techStack = techStack;
            if (status !== undefined) updateData.status = status;

            const product = await this.productService.updateProduct(id, updateData, currentUser.id);

            if (!product) {
                ResponseUtil.error(response, 'Failed to update product or product not found', 404);
                return;
            }

            ResponseUtil.success(response, product, 'Product updated successfully');
        } catch (error) {
            logger.error('Error updating product:', error);
            ResponseUtil.error(response, 'Failed to update product', 500);
        }
    }

    /**
     * Delete product
     * DELETE /api/v1/products/:id
     */
    public async deleteProduct(request: Request, response: Response): Promise<void> {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }

            const { id } = request.params;
            if (!id) {
                ResponseUtil.error(response, 'Product ID is required', 400);
                return;
            }

            const success = await this.productService.deleteProduct(id, currentUser.id);

            if (!success) {
                ResponseUtil.error(response, 'Failed to delete product or product not found', 404);
                return;
            }

            ResponseUtil.success(response, null, 'Product deleted successfully');
        } catch (error) {
            logger.error('Error deleting product:', error);
            ResponseUtil.error(response, 'Failed to delete product', 500);
        }
    }

    /**
     * Get all products (admin or public)
     * GET /api/v1/products
     */
    public async getAllProducts(request: Request, response: Response): Promise<void> {
        try {
            const products = await this.productService.getAllProducts();
            ResponseUtil.success(response, products, 'Products retrieved successfully');
        } catch (error) {
            logger.error('Error getting all products:', error);
            ResponseUtil.error(response, 'Failed to get products', 500);
        }
    }

    /**
     * Get all active products (public)
     * GET /api/v1/products/public/active
     */
    public async getActiveProducts(request: Request, response: Response): Promise<void> {
        try {
            const products = await this.productService.getActiveProducts();
            ResponseUtil.success(response, products, 'Active products retrieved successfully');
        } catch (error) {
            logger.error('Error getting active products:', error);
            ResponseUtil.error(response, 'Failed to get active products', 500);
        }
    }

    /**
     * Get product limit information for the authenticated developer
     * GET /api/v1/products/limit-info
     */
    public async getProductLimitInfo(request: Request, response: Response): Promise<void> {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }

            const limitInfo = await this.productService.getProductLimitInfo(currentUser.id);
            ResponseUtil.success(response, limitInfo, 'Product limit info retrieved successfully');
        } catch (error) {
            logger.error('Error getting product limit info:', error);
            ResponseUtil.error(response, 'Failed to get product limit info', 500);
        }
    }

    /**
     * Increment product views
     * POST /api/v1/products/:id/view
     */
    public async incrementViews(request: Request, response: Response): Promise<void> {
        try {
            const { id } = request.params;
            if (!id) {
                ResponseUtil.error(response, 'Product ID is required', 400);
                return;
            }

            const success = await this.productService.incrementViews(id);

            if (!success) {
                ResponseUtil.error(response, 'Failed to increment views', 500);
                return;
            }

            ResponseUtil.success(response, null, 'Views incremented successfully');
        } catch (error) {
            logger.error('Error incrementing views:', error);
            ResponseUtil.error(response, 'Failed to increment views', 500);
        }
    }

    /**
     * Check if developer can add more products
     * GET /api/v1/products/can-add
     */
    public async checkCanAddProduct(request: Request, response: Response): Promise<void> {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }

            const canAddCheck = await this.productService.canAddProduct(currentUser.id);
            ResponseUtil.success(response, canAddCheck, 'Product limit check completed');
        } catch (error) {
            logger.error('Error checking can add product:', error);
            ResponseUtil.error(response, 'Failed to check product limit', 500);
        }
    }

    // Upload product image
    public uploadProductImage = async (request: Request, response: Response): Promise<void> => {
        try {
            const currentUser = (request as any).user;
            
            if (!currentUser?.id) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }

            if (!request.file) {
                ResponseUtil.error(response, 'No image file uploaded', 400);
                return;
            }

            // Validate file is an image
            if (!request.file.mimetype.startsWith('image/')) {
                ResponseUtil.error(response, 'Only image files are allowed', 400);
                return;
            }

            // Upload to S3 (returns S3 key)
            const imageKey = await s3RepositoryInstance.uploadFile(
                request.file.buffer,
                `product-images/${currentUser.id}`,
                request.file.mimetype
            );

            ResponseUtil.success(response, { imageUrl: imageKey }, 'Image uploaded successfully');
        } catch (error) {
            logger.error('Error uploading product image:', error);
            ResponseUtil.error(response, 'Failed to upload image', 500);
        }
    }

    // Upload multiple product images
    public uploadProductImages = async (request: Request, response: Response): Promise<void> => {
        try {
            const currentUser = (request as any).user;
            
            if (!currentUser?.id) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }

            const files = request.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                ResponseUtil.error(response, 'No image files uploaded', 400);
                return;
            }

            // Validate all files are images
            const invalidFiles = files.filter(file => !file.mimetype.startsWith('image/'));
            if (invalidFiles.length > 0) {
                ResponseUtil.error(response, 'Only image files are allowed', 400);
                return;
            }

            // Upload all images to S3 (returns S3 keys)
            const uploadPromises = files.map(file =>
                s3RepositoryInstance.uploadFile(
                    file.buffer,
                    `product-images/${currentUser.id}`,
                    file.mimetype
                )
            );

            const imageUrls = await Promise.all(uploadPromises);

            ResponseUtil.success(response, { imageUrls }, 'Images uploaded successfully');
        } catch (error) {
            logger.error('Error uploading product images:', error);
            ResponseUtil.error(response, 'Failed to upload images', 500);
        }
    }

    private getAccessToken(request: Request): string {
        const authHeader = request.headers.authorization;
        return authHeader ? authHeader.substring(7) : '';
    }
}

