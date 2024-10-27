const app = require('./src/express/controller');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

mongoose.connect('mongodb+srv://AnnaEnkin:12345@cluster.kgo3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));



