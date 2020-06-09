import secrets from "./secrets.json";
import { Secrets } from "./secrets";

export const environment = {
  production: true,
  ...(secrets as Secrets),
};
