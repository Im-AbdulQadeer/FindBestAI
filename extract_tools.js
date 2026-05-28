// Extract TOOLS array from data.js and output as JSON
const fs = require('fs');
const path = require('path');

try {
    // Read the data.js file
    const dataPath = path.join(__dirname, 'assets/js/data.js');
    const content = fs.readFileSync(dataPath, 'utf-8');
    
    // Find the TOOLS array
    const match = content.match(/const TOOLS = \[([\s\S]*?)\];/);
    
    if (match) {
        // Wrap in array brackets
        let toolsStr = '[' + match[1] + ']';
        
        // Use Function constructor to evaluate the JavaScript (safer than eval)
        // Actually, we'll just use a regex-based JSON converter
        const tools = eval('(' + toolsStr + ')');
        
        // Output as JSON
        console.log(JSON.stringify(tools, null, 2));
    } else {
        console.error('Could not find TOOLS array in data.js');
        process.exit(1);
    }
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
