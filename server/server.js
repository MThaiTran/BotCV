const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(cors({
  origin: 'http://localhost:3000', // Không dùng '*'
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route KHÔNG yêu cầu token
// const authRoutes = require('./routes/AuthRoutes');
// app.use('/auth', authRoutes);

// const authController = require('./routes/AuthRoutes');
// app.all('*', authController.addHeader);

// app.all('*', authController.addHeader);

const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);


// API Routes (JSON Data)
const userAccountRoutes = require('./routes/UserAccountRoutes');
app.use('/api/userAccount', userAccountRoutes);
const seekerProfileRoutes = require('./routes/SeekerProfileRoutes');
app.use('/api/seekerProfile', seekerProfileRoutes);
const companyRoutes = require('./routes/CompanyRoutes');
app.use('/api/company', companyRoutes);
const cvRoutes = require('./routes/CVRoutes');
app.use('/api/cv', cvRoutes);
const jobRoutes = require('./routes/JobRoutes');
app.use('/api/job', jobRoutes);
const jobCategoryRoutes = require('./routes/JobCategoryRoutes');
app.use('/api/jobCategory', jobCategoryRoutes);
const jobLocationRoutes = require('./routes/JobLocationRoutes');
app.use('/api/jobLocation', jobLocationRoutes);
const appliedJobRoutes = require('./routes/AppliedJobRoutes');
app.use('/api/appliedJob', appliedJobRoutes);
const wishlistJobRoutes = require('./routes/WishlistJobRoutes');
app.use('/api/wishlistJob', wishlistJobRoutes);

// KHỞI ĐỘNG SERVER Ở CUỐI CÙNG
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app;
