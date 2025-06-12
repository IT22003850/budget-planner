const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');
const moment = require('moment');

router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching budgets for user:', req.user.id);
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (err) {
    console.error('Get budgets error:', err);
    res.status(500).json({ message: 'Server error fetching budgets', error: err.message });
  }
});

const validCategories = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Other'];
router.post('/', auth, async (req, res) => {
  let { category, amount, month } = req.body;
  try {
    console.log('Creating budget:', req.body, 'for user:', req.user.id);
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    if (!month || !moment(month, 'MMMM YYYY', true).isValid()) {
      return res.status(400).json({ message: 'Month must be in format "Month YYYY" (e.g., January 2025)' });
    }
    month = moment(month, 'MMMM YYYY').format('MMMM YYYY'); // Standardize format
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const budget = await Budget.create({
      userId: req.user.id,
      category,
      amount,
      month
    });
    res.status(201).json(budget);
  } catch (err) {
    console.error('Add budget error:', err);
    res.status(500).json({ message: 'Server error adding budget', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  let { category, amount, month } = req.body;
  try {
    console.log('Updating budget:', req.params.id, req.body, 'user:', req.user.id);
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (amount && amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    if (month && !moment(month, 'MMMM YYYY', true).isValid()) {
      return res.status(400).json({ message: 'Month must be in format "Month YYYY" (e.g., January 2025)' });
    }
    if (month) {
      month = moment(month, 'MMMM YYYY').format('MMMM YYYY'); // Standardize format
    }
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { category, amount, month } },
      { new: true }
    );
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (err) {
    console.error('Update budget error:', err);
    res.status(500).json({ message: 'Server error updating budget', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting budget:', req.params.id, 'for user:', req.user.id);
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    console.error('Delete budget error:', err);
    res.status(500).json({ message: 'Server error deleting budget', error: err.message });
  }
});

router.get('/report', auth, async (req, res) => {
  try {
    console.log('Generating report for user:', req.user.id);
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const report = await Budget.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: { month: '$month', category: '$category' },
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          month: '$_id.month',
          category: '$_id.category',
          total: 1,
          _id: 0
        }
      },
      { $sort: { month: 1, category: 1 } }
    ]);
    console.log('Report generated:', report);
    res.json(report);
  } catch (err) {
    console.error('Get report error:', err);
    res.status(500).json({ message: 'Server error generating report', error: err.message });
  }
});

module.exports = router;