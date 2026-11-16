const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from root and public directories
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Explicit routes for /ax/ and root
app.get(['/ax', '/ax/'], (req, res) => {
    // Tries both public/ax/index.html and ax/index.html
    res.sendFile(path.join(__dirname, 'public', 'ax', 'index.html'), (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'ax', 'index.html'), (err2) => {
                if (err2) {
                    res.sendFile(path.join(__dirname, 'index.html'));
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
