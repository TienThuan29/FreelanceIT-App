/**
 * Test script to demonstrate how to use the create developers API
 * 
 * Usage:
 * 1. Start the server: npm run dev
 * 2. Run this test script or use curl/Postman to test the API
 * 
 * API Endpoints:
 * - POST /api/test-data/create-developers?count=20
 * - DELETE /api/test-data/clear-developers
 */

import { generateMultipleDevelopers } from './create_dev';

// Test the data generation function
console.log('Testing developer data generation...');

try {
    const developers = generateMultipleDevelopers(5); // Generate 5 for testing
    
    console.log(`Generated ${developers.length} developers:`);
    developers.forEach((developer, index) => {
        console.log(`\n--- Developer ${index + 1} ---`);
        console.log(`Name: ${developer.user.fullname}`);
        console.log(`Email: ${developer.user.email}`);
        console.log(`Phone: ${developer.user.phone}`);
        console.log(`Role: ${developer.user.role}`);
        console.log(`Title: ${developer.developerProfile.title}`);
        console.log(`Experience: ${developer.developerProfile.experienceYears} years`);
        console.log(`Level: ${developer.developerProfile.developerLevel}`);
        console.log(`Hourly Rate: $${developer.developerProfile.hourlyRate}`);
        console.log(`Skills: ${developer.developerProfile.skills?.length || 0} skills`);
        console.log(`Available: ${developer.developerProfile.isAvailable ? 'Yes' : 'No'}`);
    });
    
    console.log('\n✅ Data generation test completed successfully!');
    
} catch (error) {
    console.error('❌ Error in data generation test:', error);
}

console.log('\n--- API Usage Examples ---');
console.log('\n1. Create 20 developers:');
console.log('curl -X POST "http://localhost:3000/api/test-data/create-developers?count=20" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-System-Secret: your-system-secret"');

console.log('\n2. Create 10 developers:');
console.log('curl -X POST "http://localhost:3000/api/test-data/create-developers?count=10" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-System-Secret: your-system-secret"');

console.log('\n3. Clear all developers:');
console.log('curl -X DELETE "http://localhost:3000/api/test-data/clear-developers" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "X-System-Secret: your-system-secret"');

console.log('\nNote: Replace "your-system-secret" with the actual system secret from your environment variables.');
