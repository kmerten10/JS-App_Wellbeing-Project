const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON
app.use(express.static('public')); // Serve static files from the "public" directory

// Endpoint to save the last survey score
app.post('/save-score', (req, res) => {
    const scoreData = {
        date: new Date().toISOString().split('T')[0], // Save date in YYYY-MM-DD format
        score: req.body.score
    };

    // Read existing scores or initialize an empty array
    fs.readFile('scores.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read scores' });
        }
        
        const scores = JSON.parse(data || '[]');
        scores.push(scoreData); // Add new score

        // Write updated scores back to the JSON file
        fs.writeFile('scores.json', JSON.stringify(scores, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save score' });
            }
            res.json({ message: 'Score saved successfully!' });
        });
    });
});

// Endpoint to test the server
app.get('/test', (req, res) => {
    const message = 'Hello, this is a test endpoint!';
    console.log({ message }); // Log the message to the console
    res.json({ message }); // Send the message as a response
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});