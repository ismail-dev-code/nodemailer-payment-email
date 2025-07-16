const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Configure Nodemailer
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MEALGIVER_EMAIL,
    pass: process.env.MEALGIVER_EMAIL_PASS, 
  },
});

// ✅ Email sending route with invoice-like format
app.get("/send-payment-email", async (req, res) => {
  const paymentInfo = {
    transactionId: "TXN-20250716001",
    userEmail: "ismail24dev@gmail.com",
    userName: "Ismail Hossain",
    donationDetails: "20kg Chicken Biryani Rice",
    amount: "$25.00",
    date: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
  };

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #27ae60;">MealGiver - Payment Confirmation</h2>
      <p>Dear ${paymentInfo.userName},</p>
      <p>Thank you for your payment. Your charity role donation has been successfully received.</p>

      <h3 style="margin-top: 30px;">🧾 Payment Invoice</h3>
      <table cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr style="background-color: #f2f2f2;">
          <td><strong>Transaction ID:</strong></td>
          <td>${paymentInfo.transactionId}</td>
        </tr>
        <tr>
          <td><strong>Donation:</strong></td>
          <td>${paymentInfo.donationDetails}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
          <td><strong>Amount:</strong></td>
          <td>${paymentInfo.amount}</td>
        </tr>
        <tr>
          <td><strong>Date:</strong></td>
          <td>${paymentInfo.date}</td>
        </tr>
      </table>

      <p style="margin-top: 30px;">
        If you face any issues, feel free to reply to this email.
      </p>

      <p style="margin-top: 20px;">Warm regards,<br><strong>MealGiver Team</strong></p>
    </div>
  `;

  const mailOptions = {
    from: `"MealGiver Team" <${process.env.MEALGIVER_EMAIL}>`,
    to: paymentInfo.userEmail,
    subject: "✅ Payment Confirmation - MealGiver",
    html: emailHtml,
  };

  try {
    const emailInfo = await emailTransporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", emailInfo.messageId);
    res.status(200).send({ success: true, messageId: emailInfo.messageId });
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    res.status(500).send({ success: false, message: "Email sending failed", error: error.message });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("📧 MealGiver Email Server Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
