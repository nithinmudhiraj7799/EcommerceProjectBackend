// utils/pdfGenerator.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoicePDF = async (order, fileName) => {
  const pdfDir = path.join(__dirname, "../pdfs");
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

  const filePath = path.join(pdfDir, fileName);
  const doc = new PDFDocument({ margin: 50 });

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.font("Helvetica-Bold").fontSize(20).text("Order Invoice", { align: "center" });
    doc.moveDown();

    doc.font("Helvetica").fontSize(12);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString("en-IN")}`);
    doc.text(`Customer Email: ${order.user?.email || "Not Provided"}`);
    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(14).text("Ordered Items:");
    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(12);

    let totalPrice = 0;
    if (Array.isArray(order.items)) {
      order.items.forEach((item, index) => {
        const name = item?.product?.name || "Unnamed Product";
        const price = item?.product?.price || 0;
        const quantity = item.quantity || 1;
        const itemTotal = price * quantity;
        totalPrice += itemTotal;

        doc.text(`${index + 1}. ${name} x ${quantity} @ ₹${price} = ₹${itemTotal}`);
      });
    } else {
      doc.text("No items found.");
    }

    doc.moveDown();
    doc.font("Helvetica-Bold").text(`Total Price: ₹${totalPrice}`);
    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(14).text("Shipping Address:");
    doc.moveDown(0.5);
    const addr = order.address;

    if (addr) {
      doc.font("Helvetica").fontSize(12);
      doc.text(`Name: ${addr.fullName}`);
      doc.text(`Mobile: ${addr.mobile}`);
      doc.text(`House No: ${addr.houseNo}`);
      doc.text(`Street: ${addr.street}`);
      doc.text(`City: ${addr.city}`);
      doc.text(`State: ${addr.state}`);
      doc.text(`Pin Code: ${addr.pinCode}`);
      if (addr.landmark) doc.text(`Landmark: ${addr.landmark}`);
    } else {
      doc.text("No address available.");
    }

    doc.moveDown(2);
    doc.font("Helvetica-Oblique").fontSize(12).text("Thank you for shopping with us!", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve({ filePath, fileName }));
    stream.on("error", reject);
  });
};

module.exports = { generateInvoicePDF };
