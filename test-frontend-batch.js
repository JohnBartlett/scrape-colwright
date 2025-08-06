// Test script to simulate frontend batch functionality
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

async function testBatchFrontend() {
    console.log('Testing batch frontend functionality...');
    
    try {
        // Get items
        const items = await makeRequest('/api/items');
        console.log(`Found ${items.length} items`);
        
        // Simulate selecting multiple items (first 3 items)
        const selectedItems = items.slice(0, 3).map(item => item.id);
        console.log(`Selected items: ${selectedItems.join(', ')}`);
        
        // Simulate batch update
        const batchType = 'Furniture';
        console.log(`\nApplying type "${batchType}" to ${selectedItems.length} items...`);
        
        // Process each selected item (simulating the frontend logic)
        const promises = selectedItems.map(itemId => {
            return makeRequest(`/api/item/${itemId}`, 'POST', {
                type: batchType
            });
        });

        const results = await Promise.all(promises);
        console.log('Batch update results:', results);
        
        const successCount = results.filter(r => r.ok).length;
        const errorCount = results.length - successCount;
        
        console.log(`\nBatch update summary:`);
        console.log(`- Success: ${successCount} items`);
        console.log(`- Errors: ${errorCount} items`);
        
        // Verify the updates
        const updatedItems = await makeRequest('/api/items');
        const updatedSelectedItems = updatedItems.filter(item => selectedItems.includes(item.id));
        
        console.log(`\nVerification:`);
        updatedSelectedItems.forEach(item => {
            console.log(`- Item ${item.id} (${item.item_id}): type = "${item.type}"`);
        });
        
        const allUpdated = updatedSelectedItems.every(item => item.type === batchType);
        if (allUpdated) {
            console.log('✅ All selected items were updated correctly');
        } else {
            console.log('❌ Some items were not updated correctly');
        }
        
    } catch (error) {
        console.error('Error testing batch frontend:', error);
    }
}

testBatchFrontend(); 