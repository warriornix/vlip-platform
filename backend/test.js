const express = require('express');
const app = express();
const PORT = 5000;

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Test server is working' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Test server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}/health`);
});