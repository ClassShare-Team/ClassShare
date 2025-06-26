const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 인증 코드 발송
exports.sendVerificationEmail = async (toEmail, code) => {
  const mailOptions = {
    from: `"ClassShare" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '[ClassShare] 이메일 인증코드',
    html: `
      <div style="font-family: sans-serif;">
        <h2>📩 이메일 인증코드</h2>
        <p>아래 인증코드를 입력해주세요:</p>
        <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${code}</div>
        <p>해당 코드는 10분간 유효합니다.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
