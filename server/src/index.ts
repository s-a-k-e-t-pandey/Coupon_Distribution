import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { AdminSignIn } from './types';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { AuthMiddleware } from './middleware';
import cookieParser from 'cookie-parser';



const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET || 'mysecret';


async function cleanupExpiredCoupons() {
    try {
      await prisma.coupon.deleteMany({
        where: {
            OR: [
                { expiryDate: { lt: new Date() }}, 
                { claimedQty: { gte: prisma.coupon.fields.totalQty }}
            ]
        }
      });
      console.log(new Date());
      console.log('Deleted expired coupons on startup');
    } catch (error) {
      console.error('Failed to clean up coupons:', error);
    }
}


app.post('/adminlogin', async (req: any, res: any) => {
    try {
        const { success } = AdminSignIn.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        const { email, password } = req.body;

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ error: 'Invalputid credentials' });
        }
        
        const passwordValid = await bcrypt.compare(password, admin.password);
        if (!passwordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            secret,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ token });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



app.get('/coupons/available', async (req, res)=>{
    try{
        console.log("called Available")
        const coupons = await prisma.coupon.findFirst({
            where: {
                AND: [
                    {claimedQty: { lt : prisma.coupon.fields.totalQty }},
                    {expiryDate: { gt : new Date() }}
                ]
            }
        })
        res.status(200).json(coupons);
        return;
    }catch(e){
        console.error(e);
        res.status(500).json({error: 'Internal server error'});
        return;
    }
})


// Create Coupon (Admin only)
app.post('/create-coupon', AuthMiddleware, async (req, res) => {
    try {
        const { code, totalQty, expiryDate } = req.body;
        if (!req.admin || typeof req.admin === 'string') {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const coupon = await prisma.coupon.create({
            data: {
                code,
                totalQty,
                expiryDate: new Date(expiryDate),
                AdminId: req.admin.id,
            },
        });
        
        res.status(201).json({ message: 'Coupon created successfully', coupon });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Coupon already exists or invalid data' });
    }
});


app.delete('/delete-coupon', AuthMiddleware, async (req: any, res: any) => {
    try {
        const { couponId } = req.body;
        if (!req.admin || typeof req.admin === 'string') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.log("reached here");

        await prisma.coupon.delete({
            where: {
                id: couponId,
                AdminId: req.admin.id
            }
        });

        return res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: 'Failed to delete coupon' });
    }
});

app.put('/update-coupon', AuthMiddleware, async (req: any, res: any) => {
    try {
        const { couponId, code, totalQty, expiryDate } = req.body;
        if (!req.admin || typeof req.admin === 'string') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const coupon = await prisma.coupon.update({
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
    } catch (err) {
        return res.status(400).json({ error: 'Failed to update coupon' });
    }
});


app.post('/claim-coupon', async (req: any, res: any) => {
    try {
        const { couponCode } = req.body;
        const clientIp = req.ip;
        const sessionId = req.cookies.sessionId || Math.random().toString(36).substring(7);

        console.log("Coupon Code : ", couponCode);
        if (!req.cookies.sessionId) {
            res.cookie('sessionId', sessionId, { httpOnly: true });
        }

        console.log("Client IP : ", clientIp);
        console.log("Session ID : ", sessionId);

        
        const coupon = await prisma.coupon.findUnique({
            where: { code: couponCode },
            include: { claimedBy: true }
        });
        console.log("Coupon : ", coupon);

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        if (coupon.expiryDate && coupon.expiryDate < new Date()) {
            return res.status(400).json({ error: 'Coupon has expired' });
        }

        if (coupon.claimedQty >= coupon.totalQty) {
            return res.status(400).json({ error: 'Coupon quantity exhausted' });
        }

        const existingClaim = await prisma.claimedCoupon.findFirst({
            where: {
                couponId: coupon.id,
                OR: [
                    { claimedByIp: clientIp },
                    { sessionId: sessionId }
                ]
            }
        });

        console.log("Existing Claim : ", existingClaim);

        if (existingClaim) {
            await prisma.claimedCoupon.update({
                where: { id: existingClaim.id },
                data: { claimAttempts: { increment: 1 } }
            });
            return res.status(400).json({ error: 'You have already claimed this coupon' });
        }

        await prisma.$transaction([
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
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to claim coupon' });
    }
});

app.get('/coupon-stats/:couponId', AuthMiddleware, async (req: any, res: any) => {
    try {
        if (!req.admin || typeof req.admin === 'string') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { couponId } = req.params;

        const coupon = await prisma.coupon.findUnique({
            where: {
                id: parseInt(couponId),
                AdminId: req.admin.id
            },
            include: {
                claimedBy: {
                    orderBy: {
                        claimedAt: 'desc'
                    },
                    select: {
                        id: true,
                        claimedByIp: true,
                        sessionId: true,
                        claimAttempts: true,
                        claimedAt: true
                    }
                }
            }
        });

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        const stats = {
            couponCode: coupon.code,
            totalQuantity: coupon.totalQty,
            claimedQuantity: coupon.claimedQty,
            remainingQuantity: coupon.totalQty - coupon.claimedQty,
            expiryDate: coupon.expiryDate,
            isExpired: coupon.expiryDate ? coupon.expiryDate < new Date() : false,
            claims: coupon.claimedBy,
            uniqueIPs: new Set(coupon.claimedBy.map(claim => claim.claimedByIp)).size,
            uniqueSessions: new Set(coupon.claimedBy.map(claim => claim.sessionId)).size,
            totalAttempts: coupon.claimedBy.reduce((sum, claim) => sum + claim.claimAttempts, 0)
        };

        return res.status(200).json(stats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch coupon statistics' });
    }
});


app.get('/coupons', AuthMiddleware, async (req: any, res: any) => {
    try {
        if (!req.admin || typeof req.admin === 'string') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const coupons = await prisma.coupon.findMany({
            where: {
                AdminId: req.admin.id
            },
            include: {
                _count: {
                    select: {
                        claimedBy: true
                    }
                }
            }
        });

        const couponsWithStats = coupons.map(coupon => ({
            id: coupon.id,
            code: coupon.code,
            totalQty: coupon.totalQty,
            claimedQty: coupon.claimedQty,
            remainingQty: coupon.totalQty - coupon.claimedQty,
            expiryDate: coupon.expiryDate,
            isExpired: coupon.expiryDate ? coupon.expiryDate < new Date() : false,
            totalClaims: coupon._count.claimedBy
        }));

        return res.status(200).json(couponsWithStats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch coupons' });
    }
});


async function startServer() {
    await cleanupExpiredCoupons();
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer();