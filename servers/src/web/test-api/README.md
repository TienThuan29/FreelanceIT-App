# Test Data API

This module provides APIs for generating test data for the FreelanceIT application, specifically for creating developer accounts with complete profiles.

## Features

- Generate realistic developer data with Vietnamese names and information
- Create both user profiles and developer profiles
- Include comprehensive skills, experience levels, and professional details
- Configurable number of developers to create (1-100)
- Bulk operations for testing and development

## API Endpoints

### Create Developers
**POST** `/api/test-data/create-developers`

Creates multiple developer accounts with complete profiles.

**Parameters:**
- `count` (query, optional): Number of developers to create (1-100, default: 20)

**Headers:**
- `X-System-Secret`: System secret for authentication
- `Content-Type`: application/json

**Example:**
```bash
curl -X POST "http://localhost:3000/api/test-data/create-developers?count=20" \
  -H "Content-Type: application/json" \
  -H "X-System-Secret: your-system-secret"
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully created 20 developers. 0 failed.",
  "data": {
    "created": 20,
    "failed": 0,
    "developers": [
      {
        "userId": "uuid",
        "email": "nguyenvana123@gmail.com",
        "fullname": "Nguyễn Văn A",
        "phone": "0901234567",
        "role": "DEVELOPER",
        "developerProfile": {
          "title": "Full Stack Developer",
          "bio": "Passionate developer with a love for clean code...",
          "hourlyRate": 45,
          "experienceYears": 5,
          "developerLevel": "SENIOR",
          "skills": [...],
          "rating": 4.5,
          "totalProjects": 25,
          "isAvailable": true
        }
      }
    ]
  }
}
```

### Clear Developers
**DELETE** `/api/test-data/clear-developers`

Removes all developer accounts and profiles from the database.

**Headers:**
- `X-System-Secret`: System secret for authentication

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/test-data/clear-developers" \
  -H "Content-Type: application/json" \
  -H "X-System-Secret: your-system-secret"
```

## Generated Data Details

### User Profile Data
- **Names**: Realistic Vietnamese names (first and last names)
- **Emails**: Generated from names with random numbers
- **Phone**: Vietnamese phone number format (090-099 prefixes)
- **Address**: Vietnamese communes and provinces
- **Dates**: Random birth dates (1985-2010)
- **Role**: Always set to DEVELOPER

### Developer Profile Data
- **Titles**: Various developer roles (Frontend, Backend, Full Stack, etc.)
- **Experience**: 1-10 years of experience
- **Levels**: Calculated based on experience (Junior, Mid, Senior, Lead)
- **Skills**: 3-10 randomly selected skills with proficiency levels
- **Rates**: $15-65 per hour based on experience
- **Availability**: 70% chance of being available
- **Ratings**: 3.5-5.0 star ratings
- **Projects**: 1-50 completed projects

### Skills Included
The system includes 20+ realistic skills:
- Programming Languages: JavaScript, TypeScript, Python, Java, C#, PHP
- Frameworks: React, Vue.js, Angular, Node.js
- Databases: MongoDB, PostgreSQL, MySQL, Redis
- DevOps: Docker, Kubernetes, AWS, Git
- Other: GraphQL, REST API, UI/UX, etc.

## Usage Examples

### Development Testing
```bash
# Create 20 developers for testing
curl -X POST "http://localhost:3000/api/test-data/create-developers?count=20" \
  -H "X-System-Secret: your-system-secret"

# Create 5 developers for quick testing
curl -X POST "http://localhost:3000/api/test-data/create-developers?count=5" \
  -H "X-System-Secret: your-system-secret"

# Clear all test data
curl -X DELETE "http://localhost:3000/api/test-data/clear-developers" \
  -H "X-System-Secret: your-system-secret"
```

### Integration Testing
```javascript
// Example test setup
beforeEach(async () => {
  await fetch('/api/test-data/create-developers?count=10', {
    method: 'POST',
    headers: {
      'X-System-Secret': process.env.SYSTEM_SECRET
    }
  });
});

afterEach(async () => {
  await fetch('/api/test-data/clear-developers', {
    method: 'DELETE',
    headers: {
      'X-System-Secret': process.env.SYSTEM_SECRET
    }
  });
});
```

## Security

- All endpoints require system secret authentication
- Only accessible with proper `X-System-Secret` header
- Designed for development and testing environments only

## Files Structure

```
src/web/test-api/
├── create_dev.ts              # Data generation utilities
├── test-create-developers.ts  # Test script and examples
└── README.md                  # This documentation

src/web/api/
└── test-data.api.ts           # API endpoint implementations

src/web/routes/
└── test-data.route.ts         # Route definitions
```

## Notes

- All generated passwords are set to "password123"
- Email addresses are unique but generated deterministically
- Developer levels are calculated based on experience years
- Skills are randomly selected but realistic for developers
- All dates are properly formatted for DynamoDB storage
