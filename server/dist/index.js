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
const client_1 = require("@prisma/client");
const types_1 = require("./types");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const prisma = new client_1.PrismaClient();
const secret = process.env.JWT_SECRET || 'mysecret';
app.post('/adminlogin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = types_1.AdminSignIn.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        const { email, password } = req.body;
        const admin = yield prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordValid = yield bcrypt_1.default.compare(password, admin.password);
        if (!passwordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, secret, { expiresIn: '1h' });
        return res.status(200).json({ token });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
app.post('/registeradmin', (req, res) => {
});
app.post('/add-coupon', (req, res) => {
});
app.post('/delete-coupon', (req, res) => {
});
app.post('/update-coupon', (req, res) => {
});
app.post('claim-coupon', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //normal user
}));
app.listen(port, () => {
    console.log('Server is running on port 3000');
});
