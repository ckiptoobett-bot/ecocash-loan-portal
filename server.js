const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Explicit routes for /ax/
app.get('/ax', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ax', 'index.html'));
});

app.get('/ax/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ax', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
