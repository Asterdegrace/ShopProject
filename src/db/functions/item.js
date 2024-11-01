const Item = require('../models/item');

//These functions are not used because of changed architecture

// Get all Items
exports.getAllItems = async () => {
    try {
        const items = await Item.find();
        return items;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw new Error('Could not fetch items');
    }
};

// Get item by ID
exports.getItemById = async (id) => {
    try {
        const item = await Item.findByID(id);
        if (!item) {
            throw new Error('Item not found');
        }
        return item;
    } catch (error) {
        console.error(`Error fetching item with id ${id}:`, error);
        throw new Error('Could not fetch item');
    }
};

// Add new Item
exports.createItem = async (itemData) => {
    try {
        const newItem = new Item(itemData);
        await newItem.save();
        return newItem;
    } catch (error) {
        console.error('Error creating item:', error);
        throw new Error('Could not create item');
    }
};

// Update Item
exports.updateItem = async (id, itemData) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, itemData, { new: true });
        if (!updatedItem) {
            throw new Error('Item not found');
        }
        return updatedItem;
    } catch (error) {
        console.error(`Error updating item with id ${id}:`, error);
        throw new Error('Could not update item');
    }
};

// Delete Item
exports.deleteItem = async (id) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            throw new Error('Item not found');
        }
        return deletedItem;
    } catch (error) {
        console.error(`Error deleting item with id ${id}:`, error);
        throw new Error('Could not delete item');
    }
};
