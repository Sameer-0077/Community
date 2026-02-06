# Community Platform (MERN Stack)

A full‑stack community application where users can create posts, like and comment on posts, and view a real‑time feed with infinite scrolling. The project focuses on backend performance, clean data modeling, and efficient feed loading.

---

## 🚀 Features

- User authentication with HttpOnly cookies
- Create text and media posts (images / videos)
- Like and comment on posts
- Infinite scrolling feed using cursor‑based pagination
- Optimized feed API using MongoDB aggregation pipeline
- Cloudinary image upload with automatic optimization
- Mobile‑friendly and responsive UI

---

## 🧠 Tech Stack

**Frontend**

- React
- React Router
- Zustand
- Tailwind CSS
- Intersection Observer (Infinite Scroll)
- Fetch API

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose Aggregation Pipeline

**Other Tools**

- Cloudinary (media storage & optimization)
- JWT (authentication)
- bcrypt (password hashing)
- multer (file uploading)

---

## ⚙️ Key Backend Concepts

### Aggregation‑Based Feed

- Combined posts, author details, like count, comment count, and isLiked status in one API call
- Removed multiple frontend API calls (likeCount, commentCount, isLiked)

### Cursor‑Based Pagination

- Uses createdAt + \_id as cursor
- Prevents duplicate posts during infinite scroll
- Scales well for large datasets

### Performance Optimizations

- MongoDB indexes on frequently queried fields
- Cloudinary image resizing and compression
- Reduced payload size using $project

---

## 📦 API Overview

### Get Feed Posts

```
GET /api/post/feed?limit=10&cursor={createdAt,_id}

Returns:
    {
        "posts": [],
        "nextCursor": { "createdAt": "", "_id": "" }
    }
```

### Create Post

```
POST /api/post/create
```

### Like / Unlike Post

```
POST /api/post/:postId/like
```

### Add Comment

```
POST /api/comment/:postId
```

---

## 🖼 Media Handling

- Images are uploaded to Cloudinary
- Auto‑optimized using width, quality, and format
- public_id stored to allow safe deletion

---

## 🗂 Project Structure

```
backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 └── server.js

frontend/src/
 ├── components/
 ├── pages/
 ├── store/
 └── App.jsx
```

---

## ⚙️ Environment Variables

### Backend

```
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLIENT_URL=your_frontend_url
NODE_ENV=production
```

---

## 🧪 Run Locally

### Backend

```
npm install
npm run dev
```

### Frontend

```
npm install
npm run dev
```

---

## 🧩 Key Learnings

- Designing scalable MongoDB schemas
- Writing efficient aggregation pipelines
- Handling infinite scroll edge cases
- Media optimization for real-world apps
- Managing auth securely in production

## 📄 Future Improvements

- Real‑time updates with WebSockets
- Post bookmarking
- Notification system
- Better error and retry UX

---

## 👤 Author

**Sameer**  
Aspiring Full Stack / Backend Developer  
Built with learning, performance, and clean design in mind.

---

⭐ If you like this project useful, feel free to star the repo!
