import nodemailer from "nodemailer";

interface mailBody {
  email: string;
  title: string;
  body: string;
}

const mailSender = async ({ email, title, body }: mailBody) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    });

    let info = await transporter.sendMail({
      from: `"Accredian | Referral" <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    });
    console.log(info.response);
    return info;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default mailSender;
