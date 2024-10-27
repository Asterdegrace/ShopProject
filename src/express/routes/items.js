const express = require('express');
const router = express.Router();
const Item = require('../../db/models/item'); 

// Get all items
router.get('/items', async (req, res) => {
    try {
        const items = await Item.find(); // Fetch all items from the database
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get an item by ID
/*router.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id); // Fetch item by ID
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});*/

// Create a new item 
router.post('/item', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json(newItem); // Send back the created item
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(400).json({ error: 'Invalid item data' });
    }
});

// Update an item by name

router.put('/item', async (req, res) => {
    try {
        const { itemName, toChange } = req.body;
        const dbItem = await Item.findOneAndUpdate({name: itemName }, toChange);

        if (!dbItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(dbItem); // Send back the updated item
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(400).json({ error: 'Invalid item data' });
    }
});

// Delete an item by name /api/items/:itemName
/*router.delete('/:itemName', async (req, res) => {
    try {
    
        const deletedItem = await Item.findOneAndDelete(req.params.itemName);

        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item deleted successfully', item: deletedItem });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});*/


// Export the router
module.exports = router;