# Local 478 Ideas Pipeline

A collaborative idea tracking board for IATSE Local 478 union. Members can submit ideas, and admins can organize them through a development pipeline with real-time sync.

## Features

- **Public Features**
  - View ideas in Pipeline or Category view
  - Submit new ideas with name, title, description, and categories
  - Click any idea to see full details and notes
  - Swipe/navigate between pipeline stages on mobile

- **Admin Features** (unlock with code "478")
  - Move ideas between pipeline stages
  - Flag/unflag ideas as blocked with reason
  - Add/delete notes on ideas
  - Add/remove categories from ideas
  - Create new categories
  - Delete ideas

## Pipeline Stages

1. 💡 New Idea
2. 🔍 Research
3. 🧪 Proof of Concept
4. 💻 Codebase Built
5. 🚀 Working Prototype
6. ✅ Tested & Ready
7. 🎉 Deployed

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Firebase Firestore (real-time database)
- **Build**: Vite

## Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click the gear icon → "Project settings"
4. Scroll down to "Your apps" and click the web icon (`</>`)
5. Register your app (no need to enable hosting)
6. Copy the Firebase config values

### 2. Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode"
4. Select a region close to your users

**Important**: For production, set up security rules. For testing, you can use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase config values:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_ADMIN_CODE=478
   ```

### 4. Install Dependencies and Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables in the Vercel dashboard
4. Deploy!

### Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install -D gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/repo-name/',
     // ... other config
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## Changing the Admin Code

The admin code is set via the `VITE_ADMIN_CODE` environment variable. Default is "478".

To change it:
1. Update the `.env` file locally
2. Update the environment variable in your hosting provider (Vercel, etc.)

## Project Structure

```
/src
  /components
    Header.jsx        # Top navigation with view toggle
    IdeaCard.jsx      # Card component for idea display
    IdeaModal.jsx     # Detailed idea view with admin controls
    SubmitModal.jsx   # Form for submitting new ideas
    AdminPrompt.jsx   # Admin code entry modal
    PipelineView.jsx  # Stage-based view with tabs
    CategoryView.jsx  # Category grid view
  /hooks
    useIdeas.js       # Firebase ideas CRUD operations
    useCategories.js  # Firebase categories operations
    useAdmin.js       # Admin authentication state
  /lib
    firebase.js       # Firebase initialization
    constants.js      # Stages, default categories, admin code
  App.jsx             # Main application component
  index.css           # Tailwind CSS and custom styles
```

## License

MIT
