const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// ✅ Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// ✅ Generate invoice PDF
const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    const filename = `invoice-${Date.now()}.pdf`;
    const pdfDir = path.join(__dirname, "../pdfs");
    const filePath = path.join(pdfDir, filename);
    const doc = new PDFDocument({ margin: 50 });

    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text("🧾 Order Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`📧 Email: ${order.email}`);
    doc.text(`🆔 Order ID: ${order._id}`);
    doc.moveDown();

    order.items.forEach((item, index) => {
      const name = item.product?.name || item.name || "Unnamed Product";
      doc.text(`${index + 1}. ${name} x ${item.quantity}`);
    });

    const address = typeof order.address === "object"
      ? JSON.stringify(order.address)
      : order.address || "N/A";
    doc.text(`🏠 Shipping Address: ${address}`);
    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

// // ✅ Order success email with invoice
// const sendOrderSuccessEmail = async (to, order) => {
//   try {
//      console.log("📨 Sending to:", to); 
//     console.log("📦 Order ID:", order._id);
//     const pdfPath = await generateInvoicePDF(order);

//     const mailOptions = {
//       from: `SecureVault <${process.env.USER_EMAIL}>`,
//       to,
//       subject: "✅ Order Placed Successfully",
//       html: `
//         <h2>🎉 Thank You for Your Order!</h2>
//         <p>Your order has been placed successfully. Please find the invoice attached.</p>
//       `,
//       attachments: [
//         {
//           filename: "Order-Invoice.pdf",
//           path: pdfPath,
//         },
//       ],
//     };

//     await transporter.sendMail(mailOptions);

//     // ✅ Delete PDF
//     fs.unlink(pdfPath, (err) => {
//       if (err) console.error("❌ Failed to delete PDF:", err);
//       else console.log("✅ PDF deleted after email.");
//     });

//     return true;
//   } catch (error) {
//     console.error("❌ Error sending order email:", error);
//     return false;
//   }
// };
////////////////////////////////////////////
const sendOrderSuccessEmail = async (to, order) => {
  try {
    console.log("📨 Sending to:", to);
    console.log("📦 Order ID:", order._id);

    const pdfPath = await generateInvoicePDF(order);
    console.log("📄 Invoice PDF Path:", pdfPath);
    console.log("📂 File exists:", fs.existsSync(pdfPath)); // ✅ Confirm file exists

    const mailOptions = {
      from: `SecureVault <${process.env.USER_EMAIL}>`,
      to,
      subject: "✅ Order Placed Successfully",
      text: "Thank you for your order. Please find the invoice attached.",
      html: `
        <h2>🎉 Thank You for Your Order!</h2>
        <p>Your order has been placed successfully. Please find the invoice attached.</p>
      `,
      attachments: [
        {
          filename: "Order-Invoice.pdf",
          path: pdfPath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📤 Mail sent successfully:", info.response);

    fs.unlink(pdfPath, (err) => {
      if (err) console.error("❌ Failed to delete PDF:", err);
      else console.log("✅ PDF deleted after email.");
    });

    return true;
  } catch (error) {
    console.error("❌ Error sending order email:", error);
    return false;
  }
};

/////////////////////////////////////////////////////////////////
// ✅ Order success email without PDF (for testing)
// const sendOrderSuccessEmail = async (to, order) => {
//   try {
//     console.log("📨 Sending to:", to);
//     console.log("📦 Order ID:", order._id);

//     // const pdfPath = await generateInvoicePDF(order); // ⛔ Temporarily disabled

//     const mailOptions = {
//       from: `SecureVault <${process.env.USER_EMAIL}>`,
//       to,
//       subject: "✅ Order Placed Successfully",
//       html: `
//         <h2>🎉 Thank You for Your Order!</h2>
//         <p>Your order has been placed successfully. (PDF invoice is skipped for testing.)</p>
//       `,
//       // ⛔ Attachments removed for testing
//       // attachments: [
//       //   {
//       //     filename: "Order-Invoice.pdf",
//       //     path: pdfPath,
//       //   },
//       // ],
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("📤 Mail sent response:", info.response);

//     // fs.unlink(pdfPath, (err) => { // ⛔ Skip deletion
//     //   if (err) console.error("❌ Failed to delete PDF:", err);
//     //   else console.log("✅ PDF deleted after email.");
//     // });

//     return true;
//   } catch (error) {
//     console.error("❌ Error sending order email:", error);
//     return false;
//   }
// };


// ✅ Login success email
const sendSuccessLogin = async (to) => {
  try {
    const mailOptions = {
      from: `SecureVault <${process.env.USER_EMAIL}>`,
      to,
      subject: "SecureVault - Login Notification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #4caf50;">✅ Login Successful</h2>
          <p>Someone just logged into your SecureVault account at ${new Date().toLocaleString()}.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("❌ Login email failed:", error);
    return false;
  }
};

// ✅ Forgot password email with OTP
const sendForgotPasswordEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: `SecureVault <${process.env.USER_EMAIL}>`,
      to,
      subject: "SecureVault - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #f44336;">🔐 Password Reset Requested</h2>
          <p>Your OTP is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #f44336;">${otp}</div>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("❌ Forgot password email failed:", error);
    return false;
  }
};

// ✅ Exports
module.exports = {
  sendOrderSuccessEmail,
  sendSuccessLogin,
  sendForgotPasswordEmail,
};
