// For email validation
const validateEmailRequest = (req, res, next) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ error: "All email fields are required." });
  }
  next();
};

// For SMS validation
const validateSmsRequest = (req, res, next) => {
  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: "Phone number and message are required." });
  }
  next();
};

// For PDF generation
const validatePdfRequest = (req, res, next) => {
  const { name, product, amount } = req.body;
  if (!name || !product || !amount) {
    return res.status(400).json({ error: "Name, product, and amount are required." });
  }
  next();
};

// Export all middleware functions
module.exports = {
  validateEmailRequest,
  validateSmsRequest,
  validatePdfRequest,
};
