export interface UserCodesDetails {
  emailVerificationCode: number;
  emailVerificationCodeExpires: Date;
  passwordResetToken: number;
  passwordResetTokenExpires: Date;
}
