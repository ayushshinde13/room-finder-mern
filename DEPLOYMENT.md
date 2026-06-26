# Deployment Guide for RoomFinder

This guide explains how to deploy the RoomFinder application to Vercel (frontend) and Render (backend).

## Architecture Overview

The RoomFinder application is a full-stack MERN application with:
- **Frontend**: React/Vite application in `client/room-finder`
- **Backend**: Node.js/Express server in `server`
- **Database**: MongoDB (Atlas or cloud instance)

## Deployment Strategy

We'll deploy the backend to Render and frontend to Vercel separately, which is the recommended approach for modern web applications.

## Step 1: Deploy Backend to Render

### Option A: Using the Dashboard UI

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub/GitLab account and select your RoomFinder repository
4. Configure the service:
   - **Environment**: Node.js
   - **Branch**: main (or your default branch)
   - **Build Command**: `npm run heroku-postbuild` (this will run the build steps)
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or as needed)
   - **Region**: Choose closest to your users
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret key for JWT signing
   - `CLOUDINARY_URL`: Cloudinary URL if using image uploads (optional)
6. Click "Create Web Service"

### Option B: Using the Existing render.yaml

Render can automatically deploy using the `render.yaml` file in your repository root:
1. Make sure the `render.yaml` file is committed to your repository
2. Follow Option A steps, but Render will automatically use the configuration from `render.yaml`

### Important Notes for Backend Deployment:
- The backend will build the frontend during deployment and serve it from the `public` directory
- All API requests will be served from the same domain when accessed in production
- The frontend will be accessible at the root URL of your Render service

## Step 2: Deploy Frontend to Vercel (Alternative Approach)

If you prefer to host the frontend separately on Vercel:

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click "New Project" and import your RoomFinder repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client/room-finder`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables if needed (typically not needed for frontend-only deployment)
5. Under "Settings" → "Git", configure deployment settings as desired

### Important: Update API URLs when Frontend and Backend are Separate

If you deploy frontend and backend separately, you need to update the API configuration in `client/room-finder/src/services/api.js`:

```javascript
const API = axios.create({
  // Replace YOUR_BACKEND_URL with your Render backend URL
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001/api' 
    : 'https://your-render-service.onrender.com/api',
  // ... rest of config
});
```

Also, you'll need to update CORS settings in your backend (`server/server.js`) to allow your Vercel domain:

```javascript
import cors from 'cors';

// For development and production with separate deployments
const corsOptions = {
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:5173']  // Adjust ports as needed
    : [
        'https://your-vercel-domain.vercel.app',  // Your Vercel frontend URL
        // Add other allowed origins as needed
      ]
};

app.use(cors(corsOptions));
```

## Recommended Approach: Single Backend Deployment

For simplicity and to avoid CORS issues, I recommend deploying only to Render (backend) where:
- The backend runs on Render and serves the API at `/api/*`
- The built frontend is served from the same domain at the root
- No CORS issues since both come from the same domain

In this case:
1. Deploy using the `render.yaml` file to Render
2. No need to deploy frontend separately
3. Both frontend and backend operate from the same domain

## Environment Variables Required

### For Render Deployment:
- `MONGODB_URI`: MongoDB connection string (required)
- `JWT_SECRET`: Secret for JWT token signing (required)
- `CLOUDINARY_URL`: Cloudinary URL if using image uploads (optional)

### For Vercel Frontend Deployment (if chosen):
No special environment variables typically needed since API calls go to your backend.

## Testing Your Deployment

1. Wait for both deployments to complete
2. Visit your backend URL (on Render) or frontend URL (on Vercel)
3. Test registration, login, and other functionality
4. Check browser console and network tabs for any errors

## Troubleshooting

### Common Issues:
- **CORS errors**: Usually happen when frontend and backend are on different domains. Ensure CORS is configured correctly.
- **API calls failing**: Check that your API URLs are correct for the deployed environment.
- **Static assets not loading**: Ensure your build process completes successfully.

### Logs:
- View logs in the Render dashboard for backend issues
- View logs in the Vercel dashboard for frontend issues
- Check browser developer tools for client-side errors

## Updating Deployments

Both Vercel and Render support automatic deployments from GitHub:
1. On each push to the main branch, the platforms will redeploy your application
2. You can customize which branch triggers deployments
3. You can also trigger manual deployments from the dashboard