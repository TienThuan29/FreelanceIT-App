import { Product, ProductStatus } from "@/models/product.model";
import { ProductRepository } from "@/repositories/product.repo";
import { UserPlanningRepository, PlanningRepository } from "@/repositories/planning.repo";
import { UserRepository } from "@/repositories/user.repo";
import { Role } from "@/models/user.model";
import logger from "@/libs/logger";

export class ProductService {
    private readonly productRepository: ProductRepository;
    private readonly userPlanningRepository: UserPlanningRepository;
    private readonly planningRepository: PlanningRepository;
    private readonly userRepository: UserRepository;

    // Maximum products for free users (no planning)
    private readonly FREE_USER_MAX_PRODUCTS = 1;

    constructor() {
        this.productRepository = new ProductRepository();
        this.userPlanningRepository = new UserPlanningRepository();
        this.planningRepository = new PlanningRepository();
        this.userRepository = new UserRepository();
    }

    /**
     * Get the maximum number of products a developer can upload based on their planning
     */
    private async getMaxProductsForDeveloper(developerId: string): Promise<number> {
        try {
            // Get active planning for the developer
            const activeUserPlanning = await this.userPlanningRepository.findActiveByUserId(developerId);
            
            if (!activeUserPlanning) {
                // No active planning - return free user limit
                return this.FREE_USER_MAX_PRODUCTS;
            }

            // Get the planning details
            const planning = await this.planningRepository.findById(activeUserPlanning.planningId);
            
            if (!planning) {
                // Planning not found - return free user limit
                return this.FREE_USER_MAX_PRODUCTS;
            }

            // Check if planning has developer details
            if (planning.detailDevPlanning) {
                return planning.detailDevPlanning.numberOfProducts;
            }

            // Default to free user limit if no specific limit is defined
            return this.FREE_USER_MAX_PRODUCTS;
        } catch (error) {
            logger.error('Error getting max products for developer:', error);
            return this.FREE_USER_MAX_PRODUCTS;
        }
    }

    /**
     * Check if developer can add more products
     */
    public async canAddProduct(developerId: string): Promise<{ canAdd: boolean; currentCount: number; maxAllowed: number; message?: string }> {
        try {
            const currentCount = await this.productRepository.countActiveProductsByDeveloperId(developerId);
            const maxAllowed = await this.getMaxProductsForDeveloper(developerId);

            const canAdd = currentCount < maxAllowed;

            if (!canAdd) {
                return {
                    canAdd: false,
                    currentCount,
                    maxAllowed,
                    message: `You have reached the maximum number of products (${maxAllowed}). ${maxAllowed === this.FREE_USER_MAX_PRODUCTS ? 'Upgrade your plan to add more products.' : 'Please delete existing products or upgrade your plan.'}`
                };
            }

            return {
                canAdd: true,
                currentCount,
                maxAllowed
            };
        } catch (error) {
            logger.error('Error checking if developer can add product:', error);
            return {
                canAdd: false,
                currentCount: 0,
                maxAllowed: 0,
                message: 'Error checking product limit'
            };
        }
    }

    /**
     * Create a new product
     */
    public async createProduct(productData: Omit<Product, 'id' | 'createdDate' | 'updatedDate'>, userId: string): Promise<Product | null> {
        try {
            // Verify user is a developer
            const user = await this.userRepository.findById(userId);
            if (!user || user.role !== Role.DEVELOPER) {
                logger.error('User is not a developer');
                return null;
            }

            // Check if developer can add more products
            const canAddCheck = await this.canAddProduct(userId);
            if (!canAddCheck.canAdd) {
                logger.error('Developer cannot add more products:', canAddCheck.message);
                throw new Error(canAddCheck.message);
            }

            // Ensure the product belongs to the current user
            const productToCreate = {
                ...productData,
                developerId: userId
            };

            return await this.productRepository.create(productToCreate);
        } catch (error) {
            logger.error('Error creating product:', error);
            throw error;
        }
    }

    /**
     * Get product by ID
     */
    public async getProductById(id: string): Promise<Product | null> {
        try {
            return await this.productRepository.findById(id);
        } catch (error) {
            logger.error('Error getting product by ID:', error);
            return null;
        }
    }

    /**
     * Get all products by developer ID
     */
    public async getProductsByDeveloperId(developerId: string): Promise<Product[]> {
        try {
            return await this.productRepository.findByDeveloperId(developerId);
        } catch (error) {
            logger.error('Error getting products by developer ID:', error);
            return [];
        }
    }

    /**
     * Get all products (admin/public view)
     */
    public async getAllProducts(): Promise<Product[]> {
        try {
            return await this.productRepository.findAll();
        } catch (error) {
            logger.error('Error getting all products:', error);
            return [];
        }
    }

    /**
     * Get all active products (public view)
     */
    public async getActiveProducts(): Promise<Product[]> {
        try {
            return await this.productRepository.findActiveProducts();
        } catch (error) {
            logger.error('Error getting active products:', error);
            return [];
        }
    }

    /**
     * Update product
     */
    public async updateProduct(id: string, productData: Partial<Product>, userId: string): Promise<Product | null> {
        try {
            // Get existing product
            const existingProduct = await this.productRepository.findById(id);
            if (!existingProduct) {
                logger.error('Product not found');
                return null;
            }

            // Verify user is the owner
            if (existingProduct.developerId !== userId) {
                logger.error('User is not the owner of this product');
                return null;
            }

            // Update product
            const updatedProduct = {
                ...existingProduct,
                ...productData,
                id: existingProduct.id, // Ensure ID doesn't change
                developerId: existingProduct.developerId // Ensure developer doesn't change
            };

            return await this.productRepository.update(updatedProduct);
        } catch (error) {
            logger.error('Error updating product:', error);
            return null;
        }
    }

    /**
     * Delete product (soft delete)
     */
    public async deleteProduct(id: string, userId: string): Promise<boolean> {
        try {
            // Get existing product
            const existingProduct = await this.productRepository.findById(id);
            if (!existingProduct) {
                logger.error('Product not found');
                return false;
            }

            // Verify user is the owner
            if (existingProduct.developerId !== userId) {
                logger.error('User is not the owner of this product');
                return false;
            }

            return await this.productRepository.delete(id);
        } catch (error) {
            logger.error('Error deleting product:', error);
            return false;
        }
    }

    /**
     * Increment product views
     */
    public async incrementViews(id: string): Promise<boolean> {
        try {
            return await this.productRepository.incrementViews(id);
        } catch (error) {
            logger.error('Error incrementing product views:', error);
            return false;
        }
    }

    /**
     * Get product limit info for developer
     */
    public async getProductLimitInfo(developerId: string): Promise<{
        currentCount: number;
        maxAllowed: number;
        remaining: number;
        canAddMore: boolean;
    }> {
        try {
            const currentCount = await this.productRepository.countActiveProductsByDeveloperId(developerId);
            const maxAllowed = await this.getMaxProductsForDeveloper(developerId);
            const remaining = Math.max(0, maxAllowed - currentCount);

            return {
                currentCount,
                maxAllowed,
                remaining,
                canAddMore: remaining > 0
            };
        } catch (error) {
            logger.error('Error getting product limit info:', error);
            return {
                currentCount: 0,
                maxAllowed: 0,
                remaining: 0,
                canAddMore: false
            };
        }
    }
}

