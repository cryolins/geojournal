import { CredentialsSignin } from 'next-auth';

export class InvalidCredentialsError extends CredentialsSignin {
  code = "InvalidCredentials";
}
export class MissingCredentialsError extends CredentialsSignin {
  code = "MissingCredentials";
}