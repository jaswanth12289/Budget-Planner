import Transaction from '../models/Transaction.js';

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    // Optional filters
    const { type, category, startDate, endDate } = req.query;
    
    let query = { user: req.user._id };
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
  const { type, category, amount, date, description } = req.body;

  try {
    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount,
      date: date || Date.now(),
      description,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction && transaction.user.toString() === req.user._id.toString()) {
      await transaction.deleteOne();
      res.json({ message: 'Transaction removed' });
    } else {
      res.status(404).json({ message: 'Transaction not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getTransactions, addTransaction, deleteTransaction };
