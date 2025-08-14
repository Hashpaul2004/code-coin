const express = require('express');
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');
const FinancialGoal = require('../models/FinancialGoal');
const Account = require('../models/Account');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/dashboard
// @desc    Get dashboard data
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get monthly summary
    const [income, expenses] = await Promise.all([
      Transaction.aggregate([
        { 
          $match: { 
            user: userId, 
            type: 'income',
            date: { $gte: startOfMonth, $lte: endOfMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { 
          $match: { 
            user: userId, 
            type: 'expense',
            date: { $gte: startOfMonth, $lte: endOfMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpenses = expenses[0]?.total || 0;
    const netIncome = totalIncome - totalExpenses;

    // Get recent transactions
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    // Get active budgets
    const activeBudgets = await Budget.find({ user: userId, isActive: true })
      .limit(5);

    // Get active goals
    const activeGoals = await FinancialGoal.find({ user: userId, isActive: true })
      .limit(5);

    // Get accounts
    const accounts = await Account.find({ user: userId, isActive: true });

    res.json({
      summary: {
        totalIncome,
        totalExpenses,
        netIncome,
        period: 'current_month'
      },
      recentTransactions,
      activeBudgets,
      activeGoals,
      accounts
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/financial/transactions
// @desc    Get user transactions
// @access  Private
router.get('/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;
    
    const filter = { user: req.user._id };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/financial/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/transactions', [
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').notEmpty().withMessage('Category is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transaction = new Transaction({
      ...req.body,
      user: req.user._id
    });

    await transaction.save();

    res.status(201).json({ transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/financial/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/financial/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/financial/summary
// @desc    Get financial summary
// @access  Private
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = { user: req.user._id };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const [income, expenses] = await Promise.all([
      Transaction.aggregate([
        { $match: { ...filter, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { ...filter, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpenses = expenses[0]?.total || 0;
    const netIncome = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      netIncome,
      period: { startDate, endDate }
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/financial/budgets
// @desc    Get user budgets
// @access  Private
router.get('/budgets', async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id, isActive: true })
      .sort({ createdAt: -1 });

    res.json({ budgets });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/financial/budgets
// @desc    Create a new budget
// @access  Private
router.post('/budgets', [
  body('name').notEmpty().withMessage('Budget name is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('period').isIn(['weekly', 'monthly', 'yearly']).withMessage('Invalid period')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, amount, category, period, startDate, endDate } = req.body;

    const budget = new Budget({
      user: req.user._id,
      name,
      amount,
      category,
      period,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
    });

    await budget.save();

    res.status(201).json({ budget });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/financial/budgets/:id
// @desc    Update a budget
// @access  Private
router.put('/budgets/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ budget });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/financial/budgets/:id
// @desc    Delete a budget
// @access  Private
router.delete('/budgets/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/financial/categories
// @desc    Get user categories
// @access  Private
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id, isActive: true })
      .sort({ name: 1 });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/financial/categories
// @desc    Create a new category
// @access  Private
router.post('/categories', [
  body('name').notEmpty().withMessage('Category name is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = new Category({
      ...req.body,
      user: req.user._id
    });

    await category.save();

    res.status(201).json({ category });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/financial/goals
// @desc    Get user financial goals
// @access  Private
router.get('/goals', async (req, res) => {
  try {
    const goals = await FinancialGoal.find({ user: req.user._id, isActive: true })
      .sort({ createdAt: -1 });

    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/financial/goals
// @desc    Create a new financial goal
// @access  Private
router.post('/goals', [
  body('name').notEmpty().withMessage('Goal name is required'),
  body('targetAmount').isFloat({ min: 0 }).withMessage('Target amount must be a positive number'),
  body('targetDate').isISO8601().withMessage('Valid target date is required'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = new FinancialGoal({
      ...req.body,
      user: req.user._id
    });

    await goal.save();

    res.status(201).json({ goal });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/financial/goals/:id
// @desc    Update a financial goal
// @access  Private
router.put('/goals/:id', async (req, res) => {
  try {
    const goal = await FinancialGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ goal });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/financial/goals/:id
// @desc    Delete a financial goal
// @access  Private
router.delete('/goals/:id', async (req, res) => {
  try {
    const goal = await FinancialGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/financial/accounts
// @desc    Get user accounts
// @access  Private
router.get('/accounts', async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id, isActive: true })
      .sort({ name: 1 });

    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/financial/accounts
// @desc    Create a new account
// @access  Private
router.post('/accounts', [
  body('name').notEmpty().withMessage('Account name is required'),
  body('type').isIn(['checking', 'savings', 'credit', 'investment', 'cash', 'other']).withMessage('Invalid account type'),
  body('balance').isFloat().withMessage('Balance must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const account = new Account({
      ...req.body,
      user: req.user._id
    });

    await account.save();

    res.status(201).json({ account });
  } catch (error) {
    console.error('Create account error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Account name already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/financial/accounts/:id
// @desc    Update an account
// @access  Private
router.put('/accounts/:id', async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ account });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/financial/accounts/:id
// @desc    Delete an account
// @access  Private
router.delete('/accounts/:id', async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 