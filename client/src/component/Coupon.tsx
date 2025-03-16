import { QrCode } from 'lucide-react';
import pix from '../assets/pix.png';

export default function Coupon() {
    const couponCode = "SAVE20"; // Example coupon code
    const timestamp = new Date().toLocaleString(); // Current timestamp
    const priority = 3; // Example priority (1 to 3 stars)

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
                            <p className='text-lg font-bold brightness-1000'>{couponCode}</p>
                        </div>
                        <p className="flex justify-end text-xs font-sm mt-4 brightness-1000">Valid until: {timestamp}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

