// emailConfig.js
const nodemailer = require('nodemailer');

// 💡 提示：建議使用專門的應用程式密碼 (App Password)，而不是您的 Google 帳號密碼。
// 請參閱您的郵件服務提供商的設定指南。

// 建立郵件傳輸器 (使用 Gmail 作為範例)
const transporter = nodemailer.createTransport({
    service: 'Gmail', // 您也可以使用 'smtp.office365.com' 或其他 SMTP 伺服器
    auth: {
        user: 'sayhellobro0216@gmail.com', // 替換成您的寄件人郵箱
        pass: 'jibqqizlrbecyted' // 替換成您的 App Password 或密碼
    },
    // 安全性設置：如果您的 SMTP 伺服器需要 TLS/SSL
    // secure: true, // true for 465, false for other ports
});

// 封裝發送郵件的函式
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"電影訂票系統" <sayhellobro0216@gmail.com>', // 寄件人地址
            to: to, // 收件人地址 (會員的 memberAccount)
            subject: subject, // 郵件標題
            html: html, // 郵件 HTML 內容
        });
        console.log("✅ 郵件發送成功: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ 郵件發送失敗:", error);
        return false;
    }
};

module.exports = {
    sendEmail
};