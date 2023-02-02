const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const sendmail = async (req, res) => {
  const data = req.body;

  let testAccount = await nodemailer.createTestAccount();

  let transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "jordane10@ethereal.email",
      pass: "fQx2cm8wvZhskkwVpb",
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

  let mail = MailGenerator.generate(response);
  let info = await transporter.sendMail({
    from: '"Meeth Davda" <test@gmail.com>', // sender address
    to: "test2@gmail.com", // list of receivers
    subject: "Invoice from the Store staff ", // Subject line
    text: `INVOICE \n SKU: ${data.SKU} \n Category: ${data.category} \n Quantity of stock sold: ${data.quantity} \n Total value of stock sold: ${data.price}`, // plain text body
    html: mail, // html body
  });

  console.log("Message sent: %s", info.messageId);

  res.json(info);
};
module.exports = sendmail;
