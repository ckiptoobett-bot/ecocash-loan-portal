const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve all static files from the root directory
app.use(express.static(__dirname));

// Route /ax/ directly to index.html in the root folder
app.get(['/ax', '/ax/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
