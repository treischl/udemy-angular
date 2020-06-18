import secrets from "./secrets.json";
import { Secrets } from "./secrets";

export const environment = {
  production: true,
  firebaseApiUrl: "https://udemy-ng-course-project-1a1a1.firebaseio.com",
  ...(secrets as Secrets),
};
