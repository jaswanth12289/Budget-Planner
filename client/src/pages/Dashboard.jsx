import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency';

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f43f5e', '#facc15', '#22c55e', '#0ea5e9'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, insightsRes] = await Promise.all([
          api.get('/transactions'),
          api.get('/analytics/insights')
        ]);
        setTransactions(txRes.data);
        setInsights(insightsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></motion.div>
    </div>
  );

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const recentTx = [...transactions].reverse().slice(0, 10);
  const chartData = recentTx.map(t => ({
    name: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    amount: t.amount,
  }));

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  
  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Dashboard Overview</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Welcome back! Here's your financial summary.</p>
      </motion.div>

      {/* Insight Alerts */}
      {insights?.alerts?.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-3">
          {insights.alerts.map((alert, i) => (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i*0.1) }} key={i} className={`p-4 rounded-xl flex items-center gap-4 shadow-sm backdrop-blur-md ${alert.type === 'danger' ? 'bg-red-50/80 text-red-800 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20' : 'bg-yellow-50/80 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-500/20'}`}>
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <p className="text-sm font-semibold">{alert.message}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Top Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} className="bg-white/70 dark:bg-[#151518]/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-white/5 transition-all">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/30">
              <Wallet className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Balance</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">{formatCurrency(balance)}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-white/70 dark:bg-[#151518]/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-white/5 transition-all">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/30">
              <ArrowUpRight className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Income</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white/70 dark:bg-[#151518]/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-white/5 transition-all">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-rose-400 to-rose-600 text-white rounded-2xl shadow-lg shadow-rose-500/30">
              <ArrowDownRight className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trend Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/70 dark:bg-[#151518]/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-white/5">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Spending Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} dark:opacity={0.2} />
                <XAxis dataKey="name" tick={{fill: '#8b5cf6', fontSize: 12, fontWeight: 500}} tickLine={false} axisLine={false} />
                <YAxis tick={{fill: '#6b7280', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }} 
                  itemStyle={{ color: '#fff', fontWeight: 600 }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expenses by Category */}
        <motion.div variants={itemVariants} className="bg-white/70 dark:bg-[#151518]/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-white/5">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Categories</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                  cornerRadius={4}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                  itemStyle={{ color: '#fff', fontWeight: 600 }}
                  formatter={(value) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {pieData.map((entry, index) => (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (index * 0.1) }} key={index} className="flex justify-between items-center text-sm group">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-sm transition-transform group-hover:scale-125" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors capitalize">{entry.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(entry.value)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Smart Insights Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/10 dark:to-purple-500/5 backdrop-blur-3xl p-8 rounded-3xl border border-indigo-500/20 dark:border-white/5 shadow-2xl shadow-indigo-500/5">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/50 dark:bg-black/20 rounded-2xl backdrop-blur-md">
              <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">AI Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white/60 dark:bg-black/30 backdrop-blur-md p-5 rounded-2xl border border-white/40 dark:border-white/5 transition-transform">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Predicted Spend (Next Month)</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{insights?.prediction ? formatCurrency(insights.prediction) : '...'}</p>
            </motion.div>
            
            <div className="space-y-3">
              {insights?.insights?.map((msg, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (i*0.1) }} key={i} className="bg-white/60 dark:bg-black/30 backdrop-blur-md p-4 rounded-xl flex items-center border border-white/40 dark:border-white/5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">{msg.replace(/\$/g, '₹')}</p>
                </motion.div>
              ))}
              {insights?.insights?.length === 0 && (
                <div className="bg-white/60 dark:bg-black/30 backdrop-blur-md p-4 rounded-xl flex items-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Keep adding transactions to unlock AI predictions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
