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
const user_1 = __importDefault(require("../models/user"));
const createCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { auth0Id } = req.body;
        const existUser = yield user_1.default.findOne({ auth0Id });
        if (existUser) {
            return res.status(200).send();
        }
        const newUser = new user_1.default(req.body);
        yield newUser.save();
        res.status(201).json(newUser.toObject());
    }
    catch (error) {
        res.status(500).json({
            message: error
        });
    }
});
const updateCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, addressLine1, city, country } = req.body;
        console.log("received info: ", req.body);
        console.log(req.userId);
        const currentUser = yield user_1.default.findOne({ _id: req.userId });
        if (!currentUser) {
            console.log("not found user!!!");
            return res.status(404).json({
                message: "user not found"
            });
        }
        currentUser.name = name;
        currentUser.addressLine1 = addressLine1;
        currentUser.city = city;
        currentUser.country = country;
        yield currentUser.save();
        console.log("successfully update the user info!");
        res.status(200).json({
            message: "Successfully updated!",
            updatedUser: currentUser.toObject(),
        });
    }
    catch (error) {
        console.log("found error!");
        res.status(500).json({
            message: error
        });
    }
});
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("received user id: ", req.userId);
        const currentUser = yield user_1.default.findOne({ _id: req.userId });
        if (!currentUser) {
            console.log("not found user!!!");
            return res.status(404).json({
                message: "user not found"
            });
        }
        console.log("successfully get the user info: ", currentUser.toObject());
        res.status(200).json(currentUser);
    }
    catch (error) {
        console.log("found error!");
        res.status(500).json({
            message: error
        });
    }
});
exports.default = {
    createCurrentUser: createCurrentUser,
    updateCurrentUser: updateCurrentUser,
    getCurrentUser: getCurrentUser,
};
