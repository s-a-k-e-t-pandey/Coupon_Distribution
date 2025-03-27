import { useEffect, useState } from 'react';
import nightSkyImage from '../assets/pix.png';
import Coupon from './Coupon';
import { Topbar } from './Topbar'


export default function LandingPage() {
    const [isDayTime, setIsDayTime] = useState(false);
    const [stars, setStars] = useState([]);
    const [claimed, setClaimed] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const starCount = 500;
        const newStars = Array.from({ length: starCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: 2 + Math.random() * 3
        }));
        setStars(newStars);

        const interval = setInterval(() => {
            setIsDayTime(prev => !prev);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    

    const handleClaim = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/claim-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (data.code) {
                setCouponCode(data.code);
                setClaimed(true);
            }
        } catch (error) {
            console.error('Failed to claim coupon:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`relative h-screen w-full overflow-hidden transition-all duration-1000 ${isDayTime ? 'bg-gradient-to-b from-blue-400 to-blue-200' : 'bg-gradient-to-b from-gray-900 to-gray-800'}`}>
              <Topbar></Topbar>
            <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-[5000ms]" style={{ backgroundImage: `url(${nightSkyImage})`, opacity: isDayTime ? 0 : 1 }} />

            <div className={`absolute inset-0 transition-opacity duration-1000 ${isDayTime ? 'opacity-0' : 'opacity-100'}`}>
                {stars.map(star => (
                    <div key={star.id} className="absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle" style={{ left: `${star.x}%`, top: `${star.y}%`, animationDuration: `${star.duration}s` }} />
                ))}
            </div>

            <button 
                onClick={handleClaim} 
                disabled={isLoading || claimed}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 text-lg font-bold text-white bg-white/10 border-2 border-white/20 rounded-full backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg disabled:opacity-50"
            >
                {isLoading ? 'Claiming...' : claimed ? (
                    <span className="text-yellow-400 text-2xl tracking-wider drop-shadow-md animate-fadeIn">{couponCode}</span>
                ) : 'Claim Your Coupon'}
            </button>
            {!claimed ? 
              <button 
                onClick={()=>setClaimed(true)} 
                disabled={isLoading || claimed}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 text-lg font-bold text-white bg-white/10 border-2 border-white/20 rounded-full backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Claiming...' : claimed ? (
                    <span className="text-yellow-400 text-2xl tracking-wider drop-shadow-md animate-fadeIn">{couponCode}</span>
                ) : 'Claim Your Coupon'}
              </button>
            : <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 text-lg font-bold text-white  backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg disabled:opacity-50"><Coupon ></Coupon></div>}
        </div>
    );
}