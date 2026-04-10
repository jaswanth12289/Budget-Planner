import Budget from '../models/Budget.js';

// @desc    Get user budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set or update a budget
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res) => {
  const { category, limit } = req.body;

  try {
    let budget = await Budget.findOne({ user: req.user._id, category });

    if (budget) {
      budget.limit = limit;
      const updatedBudget = await budget.save();
      res.json(updatedBudget);
    } else {
      budget = await Budget.create({
        user: req.user._id,
        category,
        limit,
      });
      res.status(201).json(budget);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (budget && budget.user.toString() === req.user._id.toString()) {
      await budget.deleteOne();
      res.json({ message: 'Budget removed' });
    } else {
      res.status(404).json({ message: 'Budget not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getBudgets, setBudget, deleteBudget };
