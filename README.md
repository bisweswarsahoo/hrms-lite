# HRMS Lite

A lightweight Human Resource Management System for managing employees and tracking attendance.

## Live Demo

- **Frontend**: [Your Netlify URL]
- **Backend API**: [Your Render/Railway URL]

## Features

### Employee Management

- Add new employees with unique Employee ID
- View all employees in a clean, organized table
- Delete employees (with cascade deletion of attendance records)
- Email validation and duplicate ID prevention

### Attendance Management

- Mark daily attendance (Present/Absent)
- View attendance records for each employee
- Display statistics: Total days, Present days, Absent days
- Date-based attendance tracking

## Tech Stack

### Frontend

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend

- **FastAPI** - Python web framework
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Database

- **MongoDB** - NoSQL database (MongoDB Atlas for cloud)

## Project Structure

```
hrms-lite/
├── backend/
│   ├── main.py              # FastAPI application & routes
│   ├── models.py            # Pydantic models
│   ├── database.py          # MongoDB connection
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── api/             # API service layer
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    ├── package.json
    └── .env                 # Environment variables
```

## Running Locally

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- MongoDB (local or Atlas account)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure environment variables:
   Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/hrms_lite
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hrms_lite
```

5. Start the backend server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

- API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

### Backend Deployment (Render/Railway)

#### Render

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
6. Deploy!

#### Railway

1. Install Railway CLI or use the dashboard
2. Run `railway login` and `railway init`
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
4. Deploy with `railway up`

### Frontend Deployment (Netlify)

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Navigate to frontend directory: `cd frontend`
3. Build the app: `npm run build`
4. Deploy: `netlify deploy --prod --dir=dist`
5. Add environment variable in Netlify dashboard:
   - `VITE_API_URL`: Your deployed backend URL

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database user and password
4. Whitelist IP addresses (0.0.0.0/0 for all IPs or specific IPs)
5. Get your connection string from "Connect" → "Connect your application"
6. Update your `MONGODB_URI` environment variable

## API Endpoints

### Employees

- `POST /employees` - Add new employee
- `GET /employees` - Get all employees
- `DELETE /employees/{emp_id}` - Delete employee

### Attendance

- `POST /attendance` - Mark attendance
- `GET /attendance/{emp_id}` - Get attendance records for an employee

## Assumptions & Limitations

1. **Single Admin**: No authentication required (single admin user assumed)
2. **Simplified Features**: Focus on core CRUD operations only
3. **No Advanced HR Features**: Leave management, payroll, etc. are out of scope
4. **Data Validation**: Basic server-side validation implemented
5. **Date Format**: Attendance dates use YYYY-MM-DD format

## UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Empty States**: Helpful messages when no data exists
- **Form Validation**: Client and server-side validation
- **Confirmation Dialogs**: Prevent accidental deletions

## CORS Configuration

The backend is configured to allow all origins in development. For production, update the CORS settings in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-netlify-site.netlify.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Backend Issues

- **Import errors**: Ensure all dependencies are installed with correct versions
- **MongoDB connection**: Verify MONGODB_URI is correct and MongoDB is running
- **Port conflicts**: Change the port in the uvicorn command if 8000 is in use

### Frontend Issues

- **API errors**: Check that backend is running and VITE_API_URL is correct
- **Build errors**: Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

## License

This project is developed as part of a coding assignment.

## Author

Bisweswar Sahoo

---

Made with ❤️ using React, FastAPI, and MongoDB
