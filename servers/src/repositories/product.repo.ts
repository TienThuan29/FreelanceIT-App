import { config } from "@/configs/config";
import { DynamoRepository } from "./dynamo.repo";
import { Product, ProductStatus } from "@/models/product.model";
import { v4 as uuidv4 } from 'uuid';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '@/configs/database';
import logger from "@/libs/logger";

export class ProductRepository extends DynamoRepository {
    constructor() {
        super(config.PRODUCT_TABLE);
    }

    public async create(product: Omit<Product, 'id' | 'createdDate' | 'updatedDate'>): Promise<Product | null> {
        const id = uuidv4();
        const createdDate = new Date();
        const updatedDate = new Date();

        const productForDynamo = {
            ...product,
            id,
            createdDate: this.convertDateToISOString(createdDate),
            updatedDate: this.convertDateToISOString(updatedDate),
            views: product.views || 0,
            likes: product.likes || 0,
            reviews: product.reviews || []
        };

        const savingResult = await this.putItem(productForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(id);
    }

    public async findById(id: string): Promise<Product | null> {
        const product = await this.getItem({ id });
        if (!product) {
            return null;
        }
        return this.convertProductFromDynamo(product);
    }

    public async findByDeveloperId(developerId: string): Promise<Product[]> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'developerId = :developerId AND #status <> :deletedStatus',
                ExpressionAttributeNames: {
                    '#status': 'status'
                },
                ExpressionAttributeValues: {
                    ':developerId': developerId,
                    ':deletedStatus': ProductStatus.DELETED
                }
            });

            const result = await dynamoDB.send(command);
            if (!result.Items) {
                return [];
            }

            return result.Items.map(item => this.convertProductFromDynamo(item));
        } catch (error) {
            logger.error('Error finding products by developerId:', error);
            return [];
        }
    }

    public async countActiveProductsByDeveloperId(developerId: string): Promise<number> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: 'developerId = :developerId AND #status <> :deletedStatus',
                ExpressionAttributeNames: {
                    '#status': 'status'
                },
                ExpressionAttributeValues: {
                    ':developerId': developerId,
                    ':deletedStatus': ProductStatus.DELETED
                }
            });

            const result = await dynamoDB.send(command);
            return result.Items?.length || 0;
        } catch (error) {
            logger.error('Error counting products by developerId:', error);
            return 0;
        }
    }

    public async findAll(): Promise<Product[]> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: '#status <> :deletedStatus',
                ExpressionAttributeNames: {
                    '#status': 'status'
                },
                ExpressionAttributeValues: {
                    ':deletedStatus': ProductStatus.DELETED
                }
            });

            const result = await dynamoDB.send(command);
            if (!result.Items) {
                return [];
            }

            return result.Items.map(item => this.convertProductFromDynamo(item));
        } catch (error) {
            logger.error('Error finding all products:', error);
            return [];
        }
    }

    public async findActiveProducts(): Promise<Product[]> {
        try {
            const command = new ScanCommand({
                TableName: this.getTableName(),
                FilterExpression: '#status = :activeStatus',
                ExpressionAttributeNames: {
                    '#status': 'status'
                },
                ExpressionAttributeValues: {
                    ':activeStatus': ProductStatus.ACTIVE
                }
            });

            const result = await dynamoDB.send(command);
            if (!result.Items) {
                return [];
            }

            return result.Items.map(item => this.convertProductFromDynamo(item));
        } catch (error) {
            logger.error('Error finding active products:', error);
            return [];
        }
    }

    public async update(product: Product): Promise<Product | null> {
        const existingProduct = await this.findById(product.id);
        if (!existingProduct) {
            return null;
        }

        const updatedProduct = {
            ...existingProduct,
            ...product,
            updatedDate: new Date()
        };

        const productForDynamo = {
            ...updatedProduct,
            createdDate: this.convertDateToISOString(updatedProduct.createdDate),
            updatedDate: this.convertDateToISOString(updatedProduct.updatedDate)
        };

        const savingResult = await this.putItem(productForDynamo);
        if (!savingResult) {
            return null;
        }
        return await this.findById(product.id);
    }

    public async delete(id: string): Promise<boolean> {
        try {
            // Soft delete - set status to DELETED
            const product = await this.findById(id);
            if (!product) {
                return false;
            }

            const updatedProduct = {
                ...product,
                status: ProductStatus.DELETED,
                updatedDate: new Date()
            };

            const productForDynamo = {
                ...updatedProduct,
                createdDate: this.convertDateToISOString(updatedProduct.createdDate),
                updatedDate: this.convertDateToISOString(updatedProduct.updatedDate)
            };

            const savingResult = await this.putItem(productForDynamo);
            return savingResult;
        } catch (error) {
            logger.error('Error deleting product:', error);
            return false;
        }
    }

    public async incrementViews(id: string): Promise<boolean> {
        try {
            const product = await this.findById(id);
            if (!product) {
                return false;
            }

            const updatedProduct = {
                ...product,
                views: (product.views || 0) + 1,
                updatedDate: new Date()
            };

            return !!(await this.update(updatedProduct));
        } catch (error) {
            logger.error('Error incrementing product views:', error);
            return false;
        }
    }

    private convertProductFromDynamo(item: any): Product {
        return {
            ...item,
            createdDate: this.convertISOStringToDate(item.createdDate),
            updatedDate: this.convertISOStringToDate(item.updatedDate)
        };
    }
}

