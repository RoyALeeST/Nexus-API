import { VerificationTypes } from 'utils/enums/verificationType.enum';

export interface CodeVerification {
  email: string;
  code: number;
  verificationType: VerificationTypes;
}
