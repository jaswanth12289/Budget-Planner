import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';

// Helper to get start and end dates of a month
const getMonthRange = (year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

// @desc    Get smart insights and alerts dynamically via AI or heuristics
// @route   GET /api/analytics/insights
// @access  Private
const getInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); 

    // Current month range
    const { start: currentStart, end: currentEnd } = getMonthRange(currentYear, currentMonth);
    // Previous month range
    const { start: prevStart, end: prevEnd } = getMonthRange(currentMonth === 0 ? currentYear - 1 : currentYear, currentMonth === 0 ? 11 : currentMonth - 1);

    // Fetch transactions
    const currMonthExps = await Transaction.find({ user: userId, type: 'expense', date: { $gte: currentStart, $lte: currentEnd } });
    const prevMonthExps = await Transaction.find({ user: userId, type: 'expense', date: { $gte: prevStart, $lte: prevEnd } });
    
    // Group by category for current month
    const currCategories = {};
    currMonthExps.forEach(t => {
      currCategories[t.category] = (currCategories[t.category] || 0) + t.amount;
    });

    // Group by category for previous month
    const prevCategories = {};
    prevMonthExps.forEach(t => {
      prevCategories[t.category] = (prevCategories[t.category] || 0) + t.amount;
    });

    let insights = [];
    const alerts = [];

    // --- NEW: GEMINI AI INTEGRATION ---
    const categoryStrings = Object.entries(currCategories).map(([cat, amt]) => `${cat}: ₹${amt.toFixed(2)}`).join(', ');

    if (process.env.GEMINI_API_KEY && categoryStrings) {
      try {
        const promptText = `Analyze this monthly budget spending data (in INR rupees): ${categoryStrings}. Give me exactly 2 very short, distinct, financial tips or insights directly addressing the user. Format the response strictly as a valid JSON array of strings (e.g., ["insight 1", "insight 2"]) and say nothing else. Return no markdown syntax, just the JSON string array.`;
        
        const aiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-goog-api-key': process.env.GEMINI_API_KEY 
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        });

        const data = await aiResponse.json();
        
        if (data && data.candidates && data.candidates.length > 0) {
          const rawText = data.candidates[0].content.parts[0].text.trim();
          const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          insights = JSON.parse(cleanedText);
        }
      } catch (err) {
        console.error("Gemini AI API Error:", err);
      }
    }

    // --- FALLBACK TO LOCAL HEURISTICS ---
    // If API failed or user has no data yet, provide mathematical insights
    if (!insights || insights.length === 0) {
      for (const [cat, amt] of Object.entries(currCategories)) {
        if (prevCategories[cat]) {
          const diff = amt - prevCategories[cat];
          const percent = ((diff / prevCategories[cat]) * 100).toFixed(0);
          
          if (diff > 0) {
            insights.push(`You spent ${percent}% more on ${cat} this month compared to last month.`);
          } else if (diff < 0) {
            insights.push(`Great job! You saved ${Math.abs(percent)}% on ${cat} this month.`);
          }
        }
      }
    }

    // Budget alerts
    const budgets = await Budget.find({ user: userId });
    budgets.forEach(b => {
      const spent = currCategories[b.category] || 0;
      if (spent > b.limit) {
        alerts.push({
          type: 'danger',
          message: `You exceeded your budget for ${b.category} by ₹${(spent - b.limit).toFixed(2)}!`
        });
      } else if (spent > b.limit * 0.8) {
        alerts.push({
          type: 'warning',
          message: `You have used ${((spent / b.limit) * 100).toFixed(0)}% of your ${b.category} budget.`
        });
      }
    });

    // Simple Auto-suggestion prediction
    const prevTotal = prevMonthExps.reduce((acc, t) => acc + t.amount, 0);
    const currTotal = currMonthExps.reduce((acc, t) => acc + t.amount, 0);
    
    let prediction = currTotal;
    if (prevTotal > 0) {
      prediction = (prevTotal + currTotal) / 2;
    }

    res.json({
      insights,
      alerts,
      prediction: prediction.toFixed(2),
      currTotal,
      prevTotal
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getInsights };
