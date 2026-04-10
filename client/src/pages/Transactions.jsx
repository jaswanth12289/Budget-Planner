import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        type, category, amount: Number(amount), description
      });
      setIsModalOpen(false);
      fetchTransactions();
      setCategory(''); setAmount(''); setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const downloadCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.amount,
      t.description || ''
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  const categories = [...new Set(transactions.map(t => t.category))];

  const filtered = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCat !== 'all' && t.category !== filterCat) return false;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Transactions</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your money flows</p>
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={downloadCSV} className="flex items-center px-4 py-2 bg-white/70 dark:bg-[#1c1c1f]/70 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252529] font-medium transition-colors shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-colors shadow-lg shadow-blue-500/25">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 bg-white/70 dark:bg-[#1c1c1f]/70 backdrop-blur-xl p-5 rounded-2xl border border-white/50 dark:border-white/5 shadow-sm">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-2">Type Filter</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full bg-gray-50/50 dark:bg-[#252529]/80 border border-gray-200 dark:border-white/5 rounded-xl p-3 outline-none font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-shadow">
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-2">Category Filter</label>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="w-full bg-gray-50/50 dark:bg-[#252529]/80 border border-gray-200 dark:border-white/5 rounded-xl p-3 outline-none font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-shadow">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-white/70 dark:bg-[#1c1c1f]/70 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-[#252529]/80 text-gray-600 dark:text-gray-400 backdrop-blur-md">
              <tr>
                <th className="p-5 font-bold uppercase tracking-wider text-xs">Date</th>
                <th className="p-5 font-bold uppercase tracking-wider text-xs">Description</th>
                <th className="p-5 font-bold uppercase tracking-wider text-xs">Category</th>
                <th className="p-5 font-bold uppercase tracking-wider text-xs">Amount</th>
                <th className="p-5 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              <AnimatePresence>
                {filtered.map((t, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    key={t._id} 
                    className="hover:bg-gray-50 dark:hover:bg-[#252529]/30 transition-colors group"
                  >
                    <td className="p-5 text-gray-600 dark:text-gray-300 font-medium">{new Date(t.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                    <td className="p-5 font-semibold text-gray-900 dark:text-white">{t.description || '-'}</td>
                    <td className="p-5">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 capitalize inline-block border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                        {t.category}
                      </span>
                    </td>
                    <td className={`p-5 font-bold text-base tracking-wide ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="p-5 text-right">
                      <button onClick={() => handleDelete(t._id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500 font-medium text-base">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white/90 dark:bg-[#1c1c1f]/90 backdrop-blur-2xl rounded-3xl w-full max-w-md p-8 border border-white/50 dark:border-white/10 shadow-2xl"
            >
              <h3 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Add Transaction</h3>
              <form onSubmit={handleAdd} className="space-y-5">
                <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100/50 dark:bg-[#252529]/50 rounded-xl">
                  <button type="button" onClick={() => setType('expense')} className={`py-2 rounded-lg font-bold text-sm transition-all ${type === 'expense' ? 'bg-white dark:bg-[#1c1c1f] text-rose-600 dark:text-rose-400 shadow-sm border border-gray-200 dark:border-white/5' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Expense</button>
                  <button type="button" onClick={() => setType('income')} className={`py-2 rounded-lg font-bold text-sm transition-all ${type === 'income' ? 'bg-white dark:bg-[#1c1c1f] text-emerald-600 dark:text-emerald-400 shadow-sm border border-gray-200 dark:border-white/5' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Income</button>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Category</label>
                  <input required type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-white/50 dark:bg-[#252529]/50 rounded-xl border border-gray-200 dark:border-white/5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow backdrop-blur-sm" placeholder="Food, Rent, Salary..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Amount (₹)</label>
                  <input required type="number" step="0.01" min="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-white/50 dark:bg-[#252529]/50 rounded-xl border border-gray-200 dark:border-white/5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow backdrop-blur-sm" placeholder="0.00" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-white/50 dark:bg-[#252529]/50 rounded-xl border border-gray-200 dark:border-white/5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow backdrop-blur-sm" placeholder="Details about this transaction" />
                </div>

                <div className="flex gap-3 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/25 transition-all">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Transactions;
