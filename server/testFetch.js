async function run() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'test', email: 'test1@test.com', password: 'pass' })
    });
    console.log("STATUS", res.status);
    const data = await res.text();
    console.log("BODY", data);
  } catch(e) { console.error(e); }
}
run();
