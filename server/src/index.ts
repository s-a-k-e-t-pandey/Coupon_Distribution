import express from 'express';
import cors from 'cors';


const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors())


app.post('/adminlogin', (req, res)=>{
    const body = req.body;
})

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