const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const sendmail = async (req, res) => {
  const data = req.body;
  // console.log(data);
  let testAccount = await nodemailer.createTestAccount();

  let transporter = await nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mjdavda02@gmail.com",
      pass: "xvbcfcnmwsscthub",
    },
  });

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });
  let response = {
    body: {
      intro: "Invoice!",
      table: {
        data: [
          {
            SKU: data.SKU,
            category: data.category,
            Quantity: data.quantity,
            Price: data.price,
          },
        ],
      },
    },
  };

  let response2 = {
    body: {
      intro: "Product Quantity Alert!",
      table: {
        data: [
          {
            SKU: data.SKU,
            category: data.category,
            Quantity: data.quantity,
          },
        ],
      },
    },
  };

  let mail = MailGenerator.generate(data.isSelling ? response : response2);
  let info = await transporter.sendMail({
    from: "mjdavda02@gmail.com", // sender address
    to: "mayur_chittaragi@rediffmail.com,pydivenkat.cs20@rvce.edu.in ", // list of receivers
    subject: data.isSelling
      ? "Invoice from the Store staff "
      : "Quantity Alerts", // Subject line
    text: `INVOICE \n SKU: ${data.SKU} \n Category: ${data.category} \n Quantity of stock sold: ${data.quantity} \n Total value of stock sold: ${data.price}`, // plain text body
    html: mail, // html body
  });

  console.log("Message sent: %s", info.messageId);

  res.json(info);
};
module.exports = sendmail;
