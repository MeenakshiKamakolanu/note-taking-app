const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const noteRoutes = require('./routes/notes');

const app = express();
let PORT = process.env.PORT || 3002; // Default port if not specified in environment

// Middleware
app.use(bodyParser.json());

// Use routes
app.use('/api/notes', noteRoutes); // Changed to match the routes defined

// Connect to MongoDB
mongoose.connect('mongodb://localhost/note-taking-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on MongoDB connection error
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something went wrong!');
});

// Attempt to start server
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${server.address().port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use. Trying another port...`);
            startServer(port + 1); // Try the next port
        } else {
            console.error('Server error:', err);
            process.exit(1); // Exit process on server startup error
        }
    });
}

// Start server on the specified port or find an available one
startServer(PORT);

module.exports = app; // Export app for testing purposes or other modules
