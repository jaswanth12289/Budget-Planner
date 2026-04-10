# Smart Budget Planner

A full-stack modern fintech application using the MERN stack (MongoDB, Express, React, Node.js). Features smart spending insights, budget tracking, dark mode, and an intuitive dashboard.

## Features

-   **User Authentication**: Secure JWT-based login/register flow.
-   **Dashboard Analytics**: Visual transaction metrics using Recharts.
-   **Smart Insights**: Automatically calculates spending habits and warns of overused budgets.
-   **Transaction Management**: Add, delete, and filter income/expenses.
-   **Export Ready**: Download transactions directly as CSV.
-   **Budget Tracker**: Setting limits for different categories.
-   **Modern UI**: Beautifully designed utilizing Tailwind CSS, Lucide Icons, with full Dark Mode support.

## Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, React Router, Recharts, Axios, Lucide React.
-   **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), bcryptjs.

## Setup Instructions

### Environment Variables

1. Go to the `server/` directory and locate the `.env` file.
2. Update the `MONGO_URI` with your own MongoDB Connection String.
3. Update `JWT_SECRET` if desired.

### Installation

1. Install root dependencies (if any):
   ```bash
   npm install
   ```
2. Open two terminals, one for the frontend and one for the backend.

### Run Backend Server

```bash
cd server
npm install
npm run dev
```

### Run Frontend Server

```bash
cd client
npm install
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Create an account via the Register page.
3. Log in to your new account.
4. Go to **Budgets** and set a limit for a category (e.g. `Food - $500`).
5. Go to **Transactions** and log some expenses and incomes.
6. Return to the **Dashboard** to see the insights and visual data distribution.

## License

MIT License.
