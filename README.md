# DineNow

A full-stack restaurant table booking platform with role-based access for customers, restaurant owners, and admins.

**Live:** https://dine-now-kappa.vercel.app/

## Features

- **Browse and search** restaurants, view details, and book available time slots
- **Customer booking management** (create, view, cancel)
- **Owner dashboard** — manage restaurant profile, available slots, and booking statuses
- **Admin dashboard** — approve/reject new restaurant listings, view platform analytics
- **Role-based authentication** (customer / owner / admin)
- **Image uploads** via Cloudinary for restaurant cover photos

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide Icons

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multer + Cloudinary (image uploads)

**Deployment**
- Frontend — Vercel
- Backend — Vercel
- Database — MongoDB Atlas

## Project Structure

```
DineNow/
├── client2/     # React frontend
└── server/      # Express backend (REST API)
```
