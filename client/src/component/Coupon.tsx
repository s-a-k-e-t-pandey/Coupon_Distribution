import { QrCode } from 'lucide-react';
import pix from '../assets/pix.png';
import { useState, useEffect } from 'react';



export default function Coupon() {
    const [coupon, setCoupon] = useState<{ code: string, expiryDate: string } | null>(null);
    const [claimed, setClaimed] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const priority = 3; 
    const time = new Date().toLocaleString();
    const expiryDate = new Date().toLocaleString();

    useEffect(() => {
        fetch("http://localhost:3000/coupons/available")
            .then((res) => res.json())
            .then((data) => setCoupon(data))
            // .then(()=>handleClaim())
            .catch((err) => console.error(err));
            console.log("called"+ coupon);
    }, []);
    
    const handleClaim = async () => {
        if (!coupon) return; // Ensure we have a coupon before claiming
        console.log("called");
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3000/claim-coupon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ couponCode: coupon.code.toString() }), // Pass couponCode
            });

            const data = await response.json();

            if (response.ok && data.code) {
                setCouponCode(data.code);
                setClaimed(true);
            } else {
                console.error("Failed to claim coupon:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Failed to claim coupon:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!coupon) return <div>Loading...</div>;

    return (
        <div className={`relative border border-4 border-dashed border-slate-800 rounded-lg max-w-[580px] max-h-[250px]`}>
            <img src={`${pix}`} alt="Coupon Code" className="absolute opacity-70 w-full max-h-[153px] object-cover rounded-md mb-2 transparent" />
            <div className="bg-white bg-opacity-60 rounded-lg p-6 h-full flex flex-col justify-between text-bold">
                <div className="flex flex-row">
                    <div className='flex flex-1 items-center justify-center brightness-1000'>
                        <QrCode size={80} />
                    </div>
                    <div className='flex flex-1 flex-col justify-center'>
                        <div className='flex justify-end brightness-1000'>
                            {Array.from({ length: 3 }, (_, index) => (
                                <span key={index} style={{ color: index < priority ? 'gold' : 'lightgray' }}>★</span>
                            ))}
                        </div>
                        <div className="flex justify-center items-center brightness-1000">
                            <p className='text-lg font-bold brightness-1000'>{coupon.code}</p>
                        </div>
                        <p className="flex justify-end text-xs font-sm mt-4 brightness-1000">Valid until: {coupon.expiryDate}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

