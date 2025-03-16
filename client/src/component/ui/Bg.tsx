import { useEffect, useState } from 'react';
import nightSkyImage from '../assets/pix.png';


export function Bg() {
    const [isDayTime, setIsDayTime] = useState(false);
    const [stars, setStars] = useState([]); 

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


    return (
        <div>
            <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-[5000ms]" style={{ backgroundImage: `url(${nightSkyImage})`, opacity: isDayTime ? 0 : 1 }} />

            <div className={`absolute inset-0 transition-opacity duration-1000 ${isDayTime ? 'opacity-0' : 'opacity-100'}`}>
                {stars.map(star => (
                    <div key={star.id} className="absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle" style={{ left: `${star.x}%`, top: `${star.y}%`, animationDuration: `${star.duration}s` }} />
                ))}
            </div>
        </div>
    )
}