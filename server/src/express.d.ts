import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AdminJwtPayload } from "./types";

declare module "express-serve-static-core" {
  interface Request {
    admin?: string | JwtPayload;
  }
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminJwtPayload;
    }
  }
}
