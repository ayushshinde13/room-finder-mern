# Room Finder Application

This is a full-stack Room Finder application built with the MERN stack (MongoDB, Express, React, Node.js) with Vite 7 as the build tool.

## Project Structure

The project consists of two main parts:
- **Frontend**: Located in `client/` (React + Vite 7 + Tailwind CSS)
- **Backend**: Located in `server/` (Node.js + Express + MongoDB)

```
d:\room-finder\
├── client/              <- Frontend (Vite 7)
├── server/              <- Backend Server
├── package.json         <- Root package.json
├── DEPLOYMENT.md        <- Deployment guide
└── README.md
```

## Deployment Setup

This application is configured for easy deployment to platforms like Heroku, Render, or Vercel.

### Frontend Features
- React with Vite 7 for fast development
- Tailwind CSS for styling
- Framer Motion for animations
- Role-based access (Owner/Renter)
- Responsive design
- Dark mode support

### Backend Features
- Node.js with Express
- MongoDB/Mongoose for database
- JWT authentication
- Role-based authorization
- RESTful API endpoints

## Installation & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local instance or Atlas)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd room-finder
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install root dependencies
   npm install
   
    # Install frontend dependencies (Vite 7)
    cd client
    npm install
    
    # Install backend dependencies
    cd ../server
    npm install
    ```

3. Set up environment variables:
   Create a `.env` file in the `server` directory with the following:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_URL=your_cloudinary_url (optional)
   NODE_ENV=development
   ```

4. Run the application:
   - For development (separate terminals):
     ```bash
     # Start backend
     cd server
     npm run dev
     
     # Start frontend (Vite 7)
     cd ../client
     npm run dev
     ```
   
   - Or use the root script to run both simultaneously:
     ```bash
     npm run dev
     ```

## Production Build

To build the application for production:

1. From the root directory, run:
   ```bash
   npm run build
   ```

This will build the Vite 7 frontend and place the static files in the server's `public` directory.

2. Then start the server:
   ```bash
   npm start
   ```

The server will automatically serve the built frontend files in production.

## Deployment

### Deploy to Render (Recommended)
The application is configured for easy deployment to Render using the `render.yaml` file. The backend will build the frontend and serve it from the same domain, avoiding CORS issues.

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Render will automatically detect and use the `render.yaml` configuration
4. Add your environment variables in the dashboard:
   - MONGODB_URI: Your MongoDB connection string
   - JWT_SECRET: A strong secret key for JWT signing
   - CLOUDINARY_URL: Cloudinary URL if using image uploads (optional)

### Deploy to Vercel (Frontend Only)
If you want to deploy the frontend separately to Vercel:

1. Go to Vercel and create a new project
2. Select the `client/room-finder` directory as the root
3. The `vercel.json` file is already configured for proper deployment
4. If deploying frontend separately, update the API URL in `client/room-finder/src/services/api.js` to point to your backend URL

For detailed deployment instructions, see the [DEPLOYMENT.md](./DEPLOYMENT.md) file.

### Deploy to Heroku
1. Create a new app
2. Connect your GitHub repository
3. Enable automatic deploys
4. Set the build command to `npm run heroku-postbuild` in the deployment settings
5. Set the start command to `npm start`
6. Add your environment variables in Settings > Config Vars

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get a specific room
- `POST /api/rooms` - Create a new room (owners only)
- `PUT /api/rooms/:id` - Update a room (owners only)
- `DELETE /api/rooms/:id` - Delete a room (owners only)
- `GET /api/rooms/owner` - Get rooms owned by the logged-in user

### Bookings
- `GET /api/bookings` - Get bookings (renters: own bookings, owners: bookings for their rooms)
- `POST /api/bookings` - Create a new booking (renters only)
- `PUT /api/bookings/:id` - Update booking status (owners only)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.