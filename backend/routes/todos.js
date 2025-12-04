const express = require('express');
const Todo = require('../models/Todo');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const todo = await Todo.create({
            title,
            description,
            user: req.user.userId,
        });
        res.status(201).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    try {
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (completed !== undefined) todo.completed = completed;

        await todo.save();

        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await todo.deleteOne();
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
