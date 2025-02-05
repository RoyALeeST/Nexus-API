import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import HTML_TEMPLATE from './templates/testMail.template';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_FROM'),
        pass: this.configService.getOrThrow<string>('MAIL_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.getOrThrow<string>('MAIL_FROM'),
        to: to,
        subject: subject,
        text: text,
        html: HTML_TEMPLATE(text),
      });
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
