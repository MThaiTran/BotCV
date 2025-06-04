const path = require('path');
const fs = require('fs');

// Upload single file (image or PDF)
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy file'
            });
        }

        // Tạo đường dẫn
        const relativePath = `/uploads/${req.file.filename}`;
        const absoluteUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

        // Trả về thông tin file đã upload
        res.status(200).json({
            success: true,
            message: 'Upload file thành công',
            data: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: relativePath,        // Đường dẫn tương đối
                url: absoluteUrl,          // Đường dẫn tuyệt đối
                // Thêm các thông tin khác nếu cần
                createdAt: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload file',
            error: error.message
        });
    }
};

// Upload multiple files
exports.uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy file'
            });
        }

        // Trả về thông tin các file đã upload
        const files = req.files.map(file => {
            const relativePath = `/uploads/${file.filename}`;
            const absoluteUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

            return {
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: relativePath,        // Đường dẫn tương đối
                url: absoluteUrl,          // Đường dẫn tuyệt đối
                // Thêm các thông tin khác nếu cần
                createdAt: new Date().toISOString()
            };
        });

        res.status(200).json({
            success: true,
            message: 'Upload nhiều file thành công',
            data: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload file',
            error: error.message
        });
    }
};

// Upload single image
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy file ảnh'
            });
        }

        // Trả về thông tin file đã upload
        res.status(200).json({
            success: true,
            message: 'Upload ảnh thành công',
            data: {
                filename: req.file.filename,
                // path: req.file.path,
                // size: req.file.size
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

// Upload multiple images
exports.uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy file ảnh'
            });
        }

        // Trả về thông tin các file đã upload
        const files = req.files.map(file => ({
            filename: file.filename,
            path: file.path,
            size: file.size
        }));

        res.status(200).json({
            success: true,
            message: 'Upload nhiều ảnh thành công',
            data: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

// Get file by filename
exports.getFile = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads', filename);

        // Kiểm tra file có tồn tại
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy file'
            });
        }

        // Gửi file
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy file',
            error: error.message
        });
    }
};
