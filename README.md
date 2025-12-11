InnoScope – Startup India Dashboard

InnoScope is a MERN-stack analytics dashboard built to visualize insights from the Indian Startup Ecosystem. It presents state-wise startup distribution, funding trends, and sector-based analytics through an interactive and modern UI.

🚀 Features

• Interactive charts and visualizations
• State-wise startup analytics
• Funding and sector breakdown
• MERN Stack (MongoDB, Express, React, Node.js)
• Secure backend with validation and JWT auth
• MongoDB Atlas + Cloudinary integration
• Modern UI using React
kk
🛠️ Tech Stack

Frontend: React, Vite, Tailwind CSS, Axios
Backend: Node.js, Express.js, MongoDB Atlas, Mongoose
Other: JWT Authentication, Cloudinary, Error-handling middleware

📁 Project Structure

client/ – React frontend
server/ – Express backend (routes, models, controllers)
.gitignore – ignores sensitive files like env and node_modules
package.json – dependencies and scripts

⚙️ Environment Variables

Create a .env file in the server folder containing:
MONGO_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

If required, create .env in client containing:
VITE_API_URL

Never commit environment variables to the repository.

🧪 Run Locally

Clone the repository → install dependencies in server and client → run both development servers independently (backend and frontend).

Frontend runs via: npm run dev
Backend runs via: npm run dev

📈 Future Enhancements

• Advanced search, sorting, filtering
• Admin dashboard with authentication
• AI-based trend prediction
• Full mobile-responsive redesign
• Timeline visualization of startup growth
• Real-time alerts for funding updates

🤝 Contributing

Contributions are welcome.
Steps:

Fork the repository

Create a new branch

Make changes and commit

Push the branch

Open a Pull Request

📄 License

This project is licensed under the MIT License.

💬 Contact

Developer: Gursirat Singh
GitHub: https://github.com/Gursirat-Singh
