import { User } from "src/users/users.model";

declare module 'express' {
  interface Request {
    user?: User;
  }
}