import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { config } from "./config";

class DynamoDB {

    private readonly dynamoDBClient: DynamoDBClient;
    private readonly region: string = config.AWS_REGION;
    private readonly accessKeyId: string = config.AWS_ACCESS_KEY_ID!;
    private readonly secretAccessKey: string = config.AWS_SECRET_ACCESS_KEY!;

    constructor() {
        this.dynamoDBClient = new DynamoDBClient({
            region: config.AWS_REGION,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            },
        });
    }
    
    public getTableName(tableName: string): string {
        const fullTableName = `${config.DYNAMODB_TABLE_PREFIX}-${tableName}`;
        return fullTableName;
    }

    public getDynamoDBClient(): DynamoDBClient {
        return this.dynamoDBClient;
    }
}

export const dynamoDbInstance = new DynamoDB();
export const dynamoDB = DynamoDBDocumentClient.from(dynamoDbInstance.getDynamoDBClient());

