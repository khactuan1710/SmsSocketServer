const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Tạo ứng dụng Express
const app = express();
const server = http.createServer(app);

// Khởi tạo Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Cho phép mọi kết nối (dùng localhost hoặc IP)
    },
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Tạo route chính để hiển thị button
app.get('/', (req, res) => {
    res.render('index');  // render file 'index.ejs'
});

// Tạo route để giả lập việc nhấn button và gửi số điện thoại
app.get('/click-button', (req, res) => {
    const phoneNumber = req.query.phone;  // Lấy số điện thoại từ query string
    console.log('Button clicked! Sending socket event to clients.');
    console.log('Phone Number:', phoneNumber);  // In ra số điện thoại

    // Gửi socket event cho tất cả các client đang kết nối
    io.emit('button_clicked', `Button was clicked! Phone number: ${phoneNumber}`);
    
    res.send(`Button click event sent to clients. Phone number: ${phoneNumber}`);
});

// Lắng nghe kết nối từ client
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
