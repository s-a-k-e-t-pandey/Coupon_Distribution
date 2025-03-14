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
const middleware_1 = require("./middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
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
            return res.status(401).json({ error: 'Invalputid credentials' });
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
// Create Coupon (Admin only)
app.post('/create-coupon', middleware_1.AuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, totalQty, expiryDate } = req.body;
        if (!req.admin || typeof req.admin === 'string') {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const coupon = yield prisma.coupon.create({
            data: {
                code,
                totalQty,
                expiryDate: new Date(expiryDate),
                AdminId: req.admin.id,
            },
        });
        res.status(201).json({ message: 'Coupon created successfully', coupon });
    }
    catch (err) {
        res.status(400).json({ error: 'Coupon already exists or invalid data' });
    }
}));
app.delete('/delete-coupon', middleware_1.AuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { couponId } = req.body;
        if (!req.admin) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        yield prisma.coupon.delete({
            where: {
                id: couponId,
                AdminId: req.admin.id
            }
        });
        return res.status(200).json({ message: 'Coupon deleted successfully' });
    }
    catch (err) {
        return res.status(400).json({ error: 'Failed to delete coupon' });
    }
}));
app.put('/update-coupon', middleware_1.AuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { couponId, code, totalQty, expiryDate } = req.body;
        if (!req.admin) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const coupon = yield prisma.coupon.update({
            where: {
                id: couponId,
                AdminId: req.admin.id
            },
            data: {
                code,
                totalQty,
                expiryDate: expiryDate ? new Date(expiryDate) : undefined
            }
        });
        return res.status(200).json({ message: 'Coupon updated successfully', coupon });
    }
    catch (err) {
        return res.status(400).json({ error: 'Failed to update coupon' });
    }
}));
app.post('/claim-coupon', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { couponCode } = req.body;
        const clientIp = req.ip;
        const sessionId = req.cookies.sessionId || Math.random().toString(36).substring(7);
        if (!req.cookies.sessionId) {
            res.cookie('sessionId', sessionId, { httpOnly: true });
        }
        const coupon = yield prisma.coupon.findUnique({
            where: { code: couponCode },
            include: { claimedBy: true }
        });
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        if (coupon.expiryDate && coupon.expiryDate < new Date()) {
            return res.status(400).json({ error: 'Coupon has expired' });
        }
        if (coupon.claimedQty >= coupon.totalQty) {
            return res.status(400).json({ error: 'Coupon quantity exhausted' });
        }
        const existingClaim = yield prisma.claimedCoupon.findFirst({
            where: {
                couponId: coupon.id,
                OR: [
                    { claimedByIp: clientIp },
                    { sessionId: sessionId }
                ]
            }
        });
        if (existingClaim) {
            yield prisma.claimedCoupon.update({
                where: { id: existingClaim.id },
                data: { claimAttempts: { increment: 1 } }
            });
            return res.status(400).json({ error: 'You have already claimed this coupon' });
        }
        yield prisma.$transaction([
            prisma.claimedCoupon.create({
                data: {
                    couponId: coupon.id,
                    claimedByIp: clientIp,
                    sessionId: sessionId
                }
            }),
            prisma.coupon.update({
                where: { id: coupon.id },
                data: { claimedQty: { increment: 1 } }
            })
        ]);
        return res.status(200).json({ message: 'Coupon claimed successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to claim coupon' });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
