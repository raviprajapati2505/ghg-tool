import sgMail from '@sendgrid/mail';
import { sendErrorMessage, sendNotificationMessage } from '@/lib/slackNotifications';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}


export async function sendEmail(options: MailOptions) {

  try {
    const notificationChannel = process.env.NOTIFICATION_CHANNEL!;


    if (notificationChannel === "EMAIL" || notificationChannel === "ALL") {
      const msg: any = {
        from: process.env.EMAIL_FROM_ADDRESS!,
        to: options.to,
        subject: options.subject,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
        html: options.html,
      };
      if (process.env.EMAIL_BCC_ADDRESS) {
        msg.bcc = process.env.EMAIL_BCC_ADDRESS?.split(',');
      }
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
      const response = await sgMail.send(msg);
    }

    if (notificationChannel === "SLACK" || notificationChannel === "ALL") {
      const slackMessage = `Email sent to ${options.to} with subject: ${options.subject}\n${options.html}`;
      await sendNotificationMessage(slackMessage);
    }

    return {};
  } catch (error: any) {
    const errorDetails = JSON.stringify(error, null, 2);
    sendErrorMessage(`Failed to send email: ${errorDetails}`);
    return { status: 500, message: 'Failed to send email.', data: errorDetails };
  }
}