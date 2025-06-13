// const express = require("express");
// const router = express.Router();
// const PDFDocument = require("pdfkit");
// const twilio = require("twilio");
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config();

// // ✅ Import email service
// const {
//   sendSuccessLogin,
//   sendForgotPasswordEmail
// } = require("../services/emailService");

// const {
//   validateSmsRequest,
//   validatePdfRequest,
// } = require("../middleware/validateNotification");

// // Create pdf folder if it doesn't exist
// const pdfDir = path.join(__dirname, "../pdfs");
// if (!fs.existsSync(pdfDir)) {
//   fs.mkdirSync(pdfDir);
// }


// // ✅ 2. Send SMS
// // router.post("/send-sms", validateSmsRequest, async (req, res) => {
// //   const { to, message } = req.body;

// //   try {
// //     const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
// //     const msg = await client.messages.create({
// //       body: message,
// //       from: process.env.TWILIO_PHONE,
// //       to,
// //     });

// //     res.status(200).json({ message: "SMS sent!", sid: msg.sid });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // ✅ 3. Generate PDF
// router.post("/generate-pdf", validatePdfRequest, async (req, res) => {
//   const { name, product, amount } = req.body;
//   const doc = new PDFDocument();
//   const filename = `invoice-${Date.now()}.pdf`;
//   const filePath = path.join(pdfDir, filename);

//   doc.pipe(fs.createWriteStream(filePath));
//   doc.fontSize(20).text("Order Invoice", { align: "center" });
//   doc.moveDown();
//   doc.text(`Name: ${name}`);
//   doc.text(`Product: ${product}`);
//   doc.text(`Amount: ₹${amount}`);
//   doc.end();

//   res.status(200).json({
//     message: "PDF created successfully!",
//     path: `/pdfs/${filename}`,
//   });
// });

// module.exports = router;
