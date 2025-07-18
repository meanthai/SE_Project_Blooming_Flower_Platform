import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { JwtPayload, decode } from "jsonwebtoken";
import User from "../src/models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string,
      auth0Id: string,
    }
  }
}

export const jwtCheck = auth({
    audience: process.env.AUTH_AUDIENCE,
    issuerBaseURL: process.env.AUTH_ISSUER,
    tokenSigningAlg: 'RS256'
  });

export const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
  console.log("in checking authentication process!");
  const { authorization } = req.headers;

  if(!authorization || !authorization.startsWith("Bearer ")){
    return res.sendStatus(401);
  }

  const accessToken = authorization.split(" ")[1];

  try {
    const decodedToken = decode(accessToken) as JwtPayload;
    const auth0Id = decodedToken.sub;

    const currentUser = await User.findOne({ auth0Id });
    
    if(!currentUser){
      return res.sendStatus(401);
    }

    console.log("Pass authorization auth0!");

    req.auth0Id = auth0Id as string;
    req.userId = currentUser._id.toString();

    next();
    
  } catch(error) {
    return res.sendStatus(401);
  }
} 