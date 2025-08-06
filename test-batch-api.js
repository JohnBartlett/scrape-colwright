// Test script for batch categorization API
const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(body);
                    resolve(jsonData);
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testBatchAPI() {
    console.log('Testing batch categorization API...');
    
    try {
        // First, get all items to find some IDs
        const items = await makeRequest('/api/items');
        
        if (items.length === 0) {
            console.log('No items found in database');
            return;
        }
        
        console.log(`Found ${items.length} items`);
        console.log('First 3 items:', items.slice(0, 3).map(item => ({ id: item.id, item_id: item.item_id, type: item.type })));
        
        // Test updating a single item's type
        const testItemId = items[0].id;
        console.log(`\nTesting update for item ID: ${testItemId}`);
        
        const updateResult = await makeRequest(`/api/item/${testItemId}`, 'POST', {
            type: 'TEST_BATCH_TYPE'
        });
        
        console.log('Update result:', updateResult);
        
        // Verify the update worked
        const updatedItems = await makeRequest('/api/items');
        const updatedItem = updatedItems.find(item => item.id === testItemId);
        
        console.log(`\nVerification - Item ${testItemId} type: "${updatedItem.type}"`);
        
        if (updatedItem.type === 'TEST_BATCH_TYPE') {
            console.log('✅ Single item update works correctly');
        } else {
            console.log('❌ Single item update failed');
        }
        
    } catch (error) {
        console.error('Error testing API:', error);
    }
}

testBatchAPI(); 