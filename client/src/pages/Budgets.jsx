import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Target, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState({});
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const fetchData = async () => {
    try {
      const [budgetsRes, txRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/transactions?type=expense') 
      ]);
      setBudgets(budgetsRes.data);

      const now = new Date();
      const currMonthTxs = txRes.data.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      const expMap = {};
      currMonthTxs.forEach(t => {
        expMap[t.category] = (expMap[t.category] || 0) + t.amount;
      });
      setExpenses(expMap);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', { category, limit: Number(limit) });
      setCategory('');
      setLimit('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

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
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Budgets</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Set intelligent caps on your spending</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Set Budget Form */}
        <motion.div variants={itemVariants} className="bg-white/70 dark:bg-[#1c1c1f]/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] h-fit relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/25">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-xl">Define a Rule</h3>
          </div>
          
          <form onSubmit={handleSetBudget} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-bold ml-1 mb-1.5 text-gray-700 dark:text-gray-300">Category Name</label>
              <input required type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-white/50 dark:bg-[#252529]/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="e.g. Restaurants" />
            </div>
            <div>
              <label className="block text-sm font-bold ml-1 mb-1.5 text-gray-700 dark:text-gray-300">Monthly Limit (₹)</label>
              <input required type="number" min="0.01" step="0.01" value={limit} onChange={e => setLimit(e.target.value)} className="w-full p-3 bg-white/50 dark:bg-[#252529]/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="5000" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all mt-4 transform hover:scale-[1.02] active:scale-[0.98]">
              Lock Budget
            </button>
          </form>
        </motion.div>

        {/* Existing Budgets */}
        <div className="lg:col-span-2 space-y-5">
          <motion.h3 variants={itemVariants} className="font-bold text-xl px-1">Active Budgets</motion.h3>
          <AnimatePresence>
            {budgets.map((b, index) => {
              const spent = expenses[b.category] || 0;
              const progress = Math.min((spent / b.limit) * 100, 100);
              const isDanger = spent >= b.limit;
              const isWarning = spent > b.limit * 0.8 && !isDanger;

              let bgGradient = 'from-blue-500 to-indigo-600';
              let ringColor = 'ring-blue-500/20';
              if (isDanger) { bgGradient = 'from-rose-500 to-red-600'; ringColor = 'ring-rose-500/20'; }
              else if (isWarning) { bgGradient = 'from-amber-400 to-orange-500'; ringColor = 'ring-amber-500/20'; }

              return (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  key={b._id} 
                  className={`bg-white/70 dark:bg-[#1c1c1f]/70 backdrop-blur-xl p-6 rounded-3xl border ${isDanger ? 'border-red-200 dark:border-red-500/20' : 'border-gray-100 dark:border-white/5'} shadow-sm ring-4 ${ringColor}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-xl text-gray-900 dark:text-white capitalize">{b.category}</h4>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                        <span className={`font-bold ${isDanger ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{formatCurrency(spent)}</span>
                        {' '}spent of {formatCurrency(b.limit)}
                      </p>
                    </div>
                    <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">Dismiss</button>
                  </div>
                  
                  {/* Progress bar container */}
                  <div className="w-full bg-gray-100 dark:bg-[#252529] rounded-full h-4 overflow-hidden relative shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${progress}%` }} 
                      transition={{ duration: 1, delay: 0.2 + (index*0.1), ease: "easeOut" }}
                      className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${bgGradient}`} 
                    ></motion.div>
                  </div>
                  
                  {isDanger && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 mt-3 text-rose-500 font-bold text-sm bg-rose-50 dark:bg-rose-500/10 inline-flex px-3 py-1.5 rounded-lg">
                      <AlertCircle className="w-4 h-4" /> Limit exceeded!
                    </motion.div>
                  )}
                  {isWarning && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 mt-3 text-amber-600 font-bold text-sm bg-amber-50 dark:bg-amber-500/10 inline-flex px-3 py-1.5 rounded-lg">
                      <AlertCircle className="w-4 h-4" /> Near budget capacity
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {budgets.length === 0 && (
            <motion.div variants={itemVariants} className="p-12 text-center text-gray-500 bg-gray-50/50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl backdrop-blur-sm">
              <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Rules Set</h3>
              <p className="font-medium">Start setting limits above to track goals.</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Budgets;
