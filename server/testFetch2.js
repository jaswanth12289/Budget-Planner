async function run() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDhjMDQ0MGEwNzQxNzNiMDE3NzQ3MyIsImlhdCI6MTc3NTgxMjY3NiwiZXhwIjoxNzc4NDA0Njc2fQ.HRK1Yj9HZOfsEhvnM6906SSFaSxr7IxHl6AoJgHGByI";
  try {
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Profile", res.status, await res.text());

    const res2 = await fetch('http://localhost:5000/api/transactions', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Tx", res2.status, await res2.text());

    const res3 = await fetch('http://localhost:5000/api/analytics/insights', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Insights", res3.status, await res3.text());

  } catch (e) {
    console.error(e);
  }
}
run();
