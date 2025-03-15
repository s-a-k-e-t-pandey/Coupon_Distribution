import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { AdminSignIn } from './types';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors())

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET || 'mysecret';

app.post('/adminlogin', async (req: any, res: any)=>{
    try{
        const {success} = AdminSignIn.safeParse(req.body);
        if(!success){
            return res.status(400).json({error: 'Invalid request body'});
        }
        const { email, password } = req.body;

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordValid = await bcrypt.compare(password, admin.password);
        if(!passwordValid){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({ id: admin.id, email: admin.email }, secret, { expiresIn: '1h' });

        return res.status(200).json({ token });
    }catch(e){
        console.error(e);
        return res.status(500).json({error: 'Internal server error'});
    }

});

app.post('/registeradmin', (req, res)=>{
    
})

app.post('/add-coupon', (req, res)=>{

})

app.post('/delete-coupon', (req, res)=>{

})

app.post('/update-coupon', (req, res)=>{

})

app.post('claim-coupon', async (req, res) => {
    //normal user
})

app.listen(port, ()=>{
    console.log('Server is running on port 3000');
})