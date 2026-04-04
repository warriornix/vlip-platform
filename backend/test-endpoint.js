const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', message: 'Test server is running' }));
});

server.listen(5000, () => {
    console.log('✅ Test server running on port 5000');
});