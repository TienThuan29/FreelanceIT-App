# Pinecone Vector Database Setup Guide

This guide explains how to configure and use Pinecone vector database with your FreelanceIT application for semantic search and developer-project matching.

## Prerequisites

1. **Pinecone Account**: Sign up at [pinecone.io](https://pinecone.io)
2. **API Key**: Get your API key from the Pinecone console
3. **Host URL**: Get your index host URL from the Pinecone console (recommended approach)

## Configuration

### 1. Environment Variables

Add the following variables to your `.env` file:

```env
# Pinecone Vector Database Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_HOST_URL=your_pinecone_host_url_here
PINECONE_INDEX_NAME=freelanceit-index
```

**Note**: The `PINECONE_HOST_URL` should be the full URL to your Pinecone index (e.g., `https://your-index-xxxxx.svc.aped-xxxxx.pinecone.io`)

### How to Get Your Pinecone Host URL

1. **Log into Pinecone Console**: Go to [app.pinecone.io](https://app.pinecone.io)
2. **Select Your Project**: Choose the project containing your index
3. **Navigate to Indexes**: Click on "Indexes" in the left sidebar
4. **Select Your Index**: Click on the index you want to use
5. **Copy Host URL**: In the index details, copy the "Host" URL (it looks like `https://your-index-xxxxx.svc.aped-xxxxx.pinecone.io`)
6. **Use in Environment**: Set this URL as your `PINECONE_HOST_URL` environment variable

### 2. Index Setup

**For Host URL Configuration (Recommended)**:
- Create your Pinecone index manually via the Pinecone console
- Use the following specifications:
  - **Dimension**: 1536 (OpenAI embedding dimension)
  - **Metric**: Cosine similarity
  - **Cloud**: Your preferred cloud provider
- Copy the index URL from the Pinecone console to use as `PINECONE_HOST_URL`

**For Environment-based Configuration**:
The application will automatically create a Pinecone index with the following specifications:
- **Dimension**: 1536 (OpenAI embedding dimension)
- **Metric**: Cosine similarity
- **Cloud**: AWS Serverless
- **Region**: us-east-1

## Usage Examples

### 1. Initialize Vector Database

```typescript
import { vectorDBRepository } from './repositories/vectordb.repo';

// Initialize the vector database connection
await vectorDBRepository.initialize();
```

### 2. Store Project Vectors

```typescript
import { vectorDBRepository, ProjectVectorData } from './repositories/vectordb.repo';

const projectData: ProjectVectorData[] = [
    {
        projectId: 'proj_123',
        title: 'E-commerce Website Development',
        description: 'Build a modern e-commerce platform with React and Node.js',
        skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        category: 'Web Development',
        userId: 'user_456',
        createdAt: '2024-01-15T10:00:00Z'
    }
];

// Assuming you have embeddings from OpenAI or another embedding service
const embeddings = [[0.1, 0.2, 0.3, ...]]; // 1536-dimensional vectors

await vectorDBRepository.storeProjectVectors(projectData, embeddings);
```

### 3. Store Developer Profile Vectors

```typescript
import { vectorDBRepository, DeveloperVectorData } from './repositories/vectordb.repo';

const developerData: DeveloperVectorData[] = [
    {
        developerId: 'dev_789',
        name: 'John Doe',
        bio: 'Full-stack developer with 5 years of experience in React and Node.js',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        experience: '5 years',
        portfolio: 'https://johndoe.dev'
    }
];

const embeddings = [[0.4, 0.5, 0.6, ...]]; // 1536-dimensional vectors

await vectorDBRepository.storeDeveloperVectors(developerData, embeddings);
```

### 4. Search Similar Projects

```typescript
// Search for projects similar to a query
const queryEmbedding = [0.7, 0.8, 0.9, ...]; // Embedding of search query

const similarProjects = await vectorDBRepository.searchSimilarProjects(
    queryEmbedding,
    10, // topK
    {
        category: 'Web Development',
        skills: ['React', 'Node.js'],
        excludeUserId: 'current_user_id'
    }
);

console.log('Similar projects:', similarProjects);
```

### 5. Find Matching Developers

```typescript
// Find developers matching project requirements
const projectEmbedding = [0.1, 0.2, 0.3, ...]; // Project embedding

const matchingDevelopers = await vectorDBRepository.findMatchingDevelopers(
    projectEmbedding,
    10, // topK
    {
        skills: ['React', 'Node.js'],
        minExperience: '3 years'
    }
);

console.log('Matching developers:', matchingDevelopers);
```

### 6. Update and Delete Operations

```typescript
// Update project vectors
await vectorDBRepository.updateProjectVectors(updatedProjectData, newEmbeddings);

// Delete project vectors
await vectorDBRepository.deleteProjectVectors(['proj_123', 'proj_456']);

// Delete developer vectors
await vectorDBRepository.deleteDeveloperVectors(['dev_789', 'dev_101']);

// Get database statistics
const stats = await vectorDBRepository.getStats();
console.log('Vector database stats:', stats);
```

## Integration with Your Application

### 1. Project Creation/Update

When creating or updating projects, generate embeddings and store them:

```typescript
// In your project service
import { vectorDBRepository } from '../repositories/vectordb.repo';
import { generateEmbedding } from '../services/embedding.service'; // You'll need to implement this

export class ProjectService {
    async createProject(projectData: any) {
        // Create project in DynamoDB
        const project = await this.createProjectInDB(projectData);
        
        // Generate embedding for the project
        const textToEmbed = `${projectData.title} ${projectData.description} ${projectData.skills.join(' ')}`;
        const embedding = await generateEmbedding(textToEmbed);
        
        // Store in vector database
        await vectorDBRepository.storeProjectVectors([{
            projectId: project.id,
            title: projectData.title,
            description: projectData.description,
            skills: projectData.skills,
            category: projectData.category,
            userId: projectData.userId,
            createdAt: project.createdAt
        }], [embedding]);
        
        return project;
    }
}
```

### 2. Developer Profile Management

Similar approach for developer profiles:

```typescript
// In your developer service
export class DeveloperService {
    async updateDeveloperProfile(developerId: string, profileData: any) {
        // Update profile in DynamoDB
        const profile = await this.updateProfileInDB(developerId, profileData);
        
        // Generate embedding for the profile
        const textToEmbed = `${profileData.name} ${profileData.bio} ${profileData.skills.join(' ')}`;
        const embedding = await generateEmbedding(textToEmbed);
        
        // Store in vector database
        await vectorDBRepository.storeDeveloperVectors([{
            developerId: profile.id,
            name: profileData.name,
            bio: profileData.bio,
            skills: profileData.skills,
            experience: profileData.experience,
            portfolio: profileData.portfolio
        }], [embedding]);
        
        return profile;
    }
}
```

## Embedding Generation

You'll need to implement an embedding service. Here's a basic example using OpenAI:

```typescript
// services/embedding.service.ts
import OpenAI from 'openai';
import { config } from '../configs/config';

const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY, // Add this to your config
});

export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small', // or text-embedding-ada-002
        input: text,
    });
    
    return response.data[0].embedding;
}
```

## Best Practices

1. **Batch Operations**: When possible, batch multiple vectors in single operations
2. **Metadata Size**: Keep metadata under 40KB per vector
3. **Index Management**: Monitor index usage and costs
4. **Error Handling**: Always wrap vector operations in try-catch blocks
5. **Performance**: Consider caching frequently accessed vectors

## Monitoring and Maintenance

- Monitor Pinecone console for usage metrics
- Set up alerts for high usage or errors
- Regularly clean up old or unused vectors
- Consider implementing vector compression for large datasets

## Troubleshooting

### Common Issues

1. **Index Not Found**: Ensure the index name matches your configuration
2. **Dimension Mismatch**: Verify embedding dimensions match index configuration (1536)
3. **API Key Issues**: Check your Pinecone API key and environment
4. **Rate Limits**: Implement exponential backoff for retries

### Debug Mode

Enable debug logging to troubleshoot issues:

```typescript
// In your config
LOG_LEVEL=debug
```

This will provide detailed logs of all vector database operations.
