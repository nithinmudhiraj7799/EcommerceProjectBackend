const express = require("express");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const router = express.Router();

router.post("/download-invoice", async (req, res) => {
  const { name, email, address, items } = req.body;

  try {
    const doc = new PDFDocument();
    const fileName = `invoice_${Date.now()}.pdf`;
    const invoicesDir = path.join(__dirname, "../invoices");

    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const filePath = path.join(invoicesDir, fileName);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Address: ${address}`);
    doc.moveDown();

    let total = 0;
    items.forEach((item, index) => {
      const lineTotal = item.quantity * item.price;
      total += lineTotal;
      doc.text(`${index + 1}. ${item.product} - ₹${item.price} x ${item.quantity} = ₹${lineTotal}`);
    });

    doc.moveDown();
    doc.font("Helvetica-Bold").text(`Total: ₹${total}`);
    doc.end();

    writeStream.on("finish", () => {
      const downloadURL = `${req.protocol}://${req.get("host")}/invoices/${fileName}`;
      res.json({ downloadURL });
    });

    writeStream.on("error", (err) => {
      console.error("PDF stream error:", err);
      res.status(500).json({ error: "Failed to generate invoice" });
    });

  } catch (err) {
    console.error("Invoice generation error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
