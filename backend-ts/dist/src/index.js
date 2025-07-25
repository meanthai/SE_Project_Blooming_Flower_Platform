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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const MyUserRoute_1 = __importDefault(require("./routes/MyUserRoute"));
function DBInitialization() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new mongodb_1.MongoClient(String(process.env.MONGODB_CONNECTION_STRING));
        try {
            const ok = yield client.connect();
            // console.log(ok)
            const moviesCollection = client.db("sample_mflix").collection("movies");
            console.log("successfully connect to the Mongo database!");
            return moviesCollection;
        }
        catch (e) {
            console.error(e);
        }
    });
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/my/user', MyUserRoute_1.default);
app.use('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ message: "OK!" });
}));
mongoose_1.default.connect(String(process.env.MONGODB_CONNECTION_STRING))
    .then(() => {
    console.log("Successfully connect to the database");
});
app.listen(4046, () => {
    console.log("Backend server started on the port 4046");
});
