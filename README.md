Budget Planner
Budget Planner is a full-stack web application that helps users manage their finances by creating, tracking, and analyzing budgets across various categories. It features user authentication (including Google OAuth), a responsive UI, and data visualization for budget analytics.
Table of Contents

Features
Tech Stack
Installation
Environment Variables
Running the Application
Usage
Folder Structure
Contributing
License

Features

User Authentication:
Register and login with username/password.
Google OAuth 2.0 integration for seamless login.
JWT-based session management.
Profile management (update password, delete account).


Budget Management:
Create, update, and delete budgets.
Categorize budgets (e.g., Food, Rent, Utilities).
Filter budgets by category and month.


Analytics:
Visualize budget data with bar and pie charts.
Filter analytics by date range.


Responsive Design:
Mobile-friendly interface with dark/light mode toggle.


Error Handling:
Client-side form validation.
Server-side validation and error logging.


Data Persistence:
MongoDB for storing user and budget data.



Tech Stack
Backend

Node.js with Express.js for the server.
MongoDB with Mongoose for data storage.
Passport.js for Google OAuth authentication.
JWT (JSON Web Tokens) for session management.
bcryptjs for password hashing.
moment for date handling.

Frontend

React with React Router for SPA routing.
React Query (Tanstack Query) for data fetching and state management.
React Hook Form with Zod for form validation.
Chart.js with react-chartjs-2 for data visualization.
Framer Motion for animations.
Tailwind CSS for styling.
react-hot-toast for notifications.
react-datepicker for date picking.

Other Tools

dotenv for environment variable management.
axios for HTTP requests.
nodemon for development server auto-reload.

Installation

Clone the repository:
git clone https://github.com/your-username/budget-planner.git
cd budget-planner


Install backend dependencies:
cd server
npm install


Install frontend dependencies:
cd ../client
npm install



Environment Variables
Create a .env file in the server directory with the following variables:
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/Budget-Planner?retryWrites=true&w=majority
JWT_SECRET=<your_jwt_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
PORT=5000


MONGODB_URI: MongoDB connection string (replace <username>, <password>, and <cluster> with your MongoDB Atlas credentials).
JWT_SECRET: A secret key for signing JWTs (e.g., a random string like my_secret_key_22003850).
GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET: Obtain these from the Google Cloud Console for OAuth setup.
PORT: The port for the backend server (defaults to 5000).

Running the Application

Start the backend server:
cd server
npm run dev

The backend will run on http://localhost:5000.

Start the frontend server:Open a new terminal, then:
cd client
npm start

The frontend will run on http://localhost:3000.

Access the application:Open your browser and navigate to http://localhost:3000.


Usage

Register or Login:
Create an account using the Register page or log in with existing credentials.
Alternatively, use the "Login with Google" option.


Dashboard:
Add budgets using the Budget Form (select category, amount, and month).
View and manage budgets in the Budget List (edit or delete).
Analyze budgets with charts in the Analytics section (filter by date range).


Profile:
Update your password (if not using Google login).
Delete your account (this also removes all associated budgets).


Dark/Light Mode:
Toggle between themes using the ThemeToggle button in the navbar.



Folder Structure
budget-planner/
├── client/
│   ├── src/
│   │   ├── components/         # React components (e.g., Dashboard, BudgetForm)
│   │   ├── context/            # AuthContext for user state
│   │   ├── hooks/              # Custom hooks (e.g., useAuth, useBudgets)
│   │   ├── lib/                # API client configuration
│   │   ├── App.js              # Main app with routes
│   │   ├── index.js            # Entry point with ErrorBoundary
│   │   └── index.css           # Global styles
├── server/
│   ├── config/                 # Passport.js configuration
│   ├── middleware/             # Authentication middleware
│   ├── models/                 # Mongoose schemas (User, Budget)
│   ├── routes/                 # Express routes (auth, budget)
│   ├── .env                    # Environment variables
│   ├── server.js               # Express server setup
│   └── package.json            # Backend dependencies
├── README.md                   # Project documentation

