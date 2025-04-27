import { CLIENT_URL } from "../config/environment";

export const EMAIL_VERIFICATION_MAIl = (token: string) => {
  const verificationUrl = CLIENT_URL + `/verify?token=${token}`;

  return {
    subject: "Verify Your Email Address",
    body: `Click the following link to verify your email address: ${verificationUrl}`,
  };
};
