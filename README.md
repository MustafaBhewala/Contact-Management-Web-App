# Contact Management Web App

A full-stack MERN application for managing contacts with a unique neo-brutalist UI design.

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **State Management**: React useState

## Features

- ✅ Add new contacts with validation
- ✅ View all contacts in real-time
- ✅ Delete contacts
- ✅ Responsive neo-brutalist design
- ✅ Form validation with error messages
- ✅ Success notifications

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MustafaBhewala/Contact-Management-Web-App.git
cd Contact-Management-Web-App
```

2. Install all dependencies:

```bash
npm run install-all
```

3. Setup MongoDB Atlas:

   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string
   - Create `backend/.env` file with:

   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Run the application:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
├── backend/           # Express.js API
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── config/        # Database configuration
│   └── server.js      # Entry point
├── frontend/          # React.js app
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
└── package.json       # Root package file
```

## API Endpoints

- `POST /api/contacts` - Create a new contact
- `GET /api/contacts` - Get all contacts
- `DELETE /api/contacts/:id` - Delete a contact

## Author

Mustafa Bhewala
