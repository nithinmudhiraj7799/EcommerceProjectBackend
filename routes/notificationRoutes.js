const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const {
  validateEmailRequest,
  validateSmsRequest,
  validatePdfRequest
} = require("../middleware/validateNotification");

// Auto-create pdfs folder if not exists
const pdfDir = path.join(__dirname, "../pdfs");
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

// ✅ 1. Send Email
router.post("/send-email",validateEmailRequest, async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text: message,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 2. Send SMS
router.post("/send-sms",validateSmsRequest ,async (req, res) => {
  const { to, message } = req.body;

  try {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    const msg = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });

    res.status(200).json({ message: "SMS sent!", sid: msg.sid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 3. Generate PDF
router.post("/generate-pdf",validatePdfRequest, async (req, res) => {
  const { name, product, amount } = req.body;
  const doc = new PDFDocument();
  const filename = `invoice-${Date.now()}.pdf`;
  const filePath = path.join(pdfDir, filename);

  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(20).text("Order Invoice", { align: "center" });
  doc.moveDown();
  doc.text(`Name: ${name}`);
  doc.text(`Product: ${product}`);
  doc.text(`Amount: ₹${amount}`);
  doc.end();

  res.status(200).json({
    message: "PDF created successfully!",
    path: `/pdfs/${filename}`,
  });
});

module.exports = router;
