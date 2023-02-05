const express = require("express");
const sendmail = require("../controllers/emailCon");

const router = express.Router();
router.post("/", sendmail);

module.exports = router;
