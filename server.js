const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const CronJob = require("cron").CronJob;

const app = express();
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "syedhadifreelancer@gmail.com",
    pass: "gjmkuoefcpyalird",
  },
});

app.get("/", (req, res) => {
  const { renterName, rentDate, rentAddress, rentPrice } = req.body;

  var job = new CronJob(
    "*/5 * * * *",
    async function () {
      const info = await transporter.sendMail({
        from: "syedhadifreelancer@gmail.com", // sender address
        to: ["syed.hadi.mh902@gmail.com", "ar2363152@gmail.com"], // list of receivers
        subject: "Rent Collection Reminder", // Subject line
        text: "Rent Collection Reminder", // plain text body
        html: `<h1>Rent Collection Reminder</h1><br/><h2>Renter Name : ${renterName}</h2><br/><h2>Rent Price : ${rentPrice}</h2><br/><h2>Rent Address : ${rentAddress}</h2>`, // html body
      });

      console.log("Message sent: %s", info.response);
    },
    null,
    true,
    "America/Los_Angeles"
  );

  try {
    // const cronExpression = `0 0 ${rentDate} * *`;

    job.start();

    res.send("Email scheduled successfully!");
  } catch (error) {
    console.error("Error scheduling email:", error);
    res.status(500).send(`${error}`);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
