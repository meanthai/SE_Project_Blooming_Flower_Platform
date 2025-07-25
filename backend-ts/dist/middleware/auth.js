"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtParse = exports.jwtCheck = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = __importDefault(require("../src/models/user"));
exports.jwtCheck = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: process.env.AUTH_AUDIENCE,
    issuerBaseURL: process.env.AUTH_ISSUER,
    tokenSigningAlg: 'RS256'
});
const jwtParse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }
    const accessToken = authorization.split(" ")[1];
    try {
        const decodedToken = (0, jsonwebtoken_1.decode)(accessToken);
        const auth0Id = decodedToken.sub;
        const currentUser = yield user_1.default.findOne({ auth0Id });
        if (!currentUser) {
            return res.sendStatus(401);
        }
        req.auth0Id = auth0Id;
        req.userId = currentUser._id.toString();
        next();
    }
    catch (error) {
        return res.sendStatus(401);
    }
});
exports.jwtParse = jwtParse;
