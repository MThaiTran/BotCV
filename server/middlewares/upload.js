const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Tạo tên file: timestamp + tên gốc
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Kiểm tra file type
const fileFilter = (req, file, cb) => {
    // Chấp nhận ảnh và PDF
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh hoặc PDF!'), false);
    }
};

// Cấu hình upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    }
});

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File quá lớn. Kích thước tối đa là 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Lỗi upload: ${err.message}`
        });
    }
    next(err);
};

module.exports = { upload, handleMulterError }; 