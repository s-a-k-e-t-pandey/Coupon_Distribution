import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import nightSkyImage from '../assets/pix.png';
import axios from 'axios';
import { BACKEND_URL } from '../config';


const FloatingCoupon = styled.div`
  position: absolute;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  animation: float 15s infinite linear;
  opacity: 0.6;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  box-shadow: 0 0 15px ${props => props.color};
  border: 1px solid ${props => props.color};
  color: ${props => props.color};

  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(100px, 100px) rotate(180deg); }
    100% { transform: translate(0, 0) rotate(360deg); }
  }
`;

const LoginContainer = styled.div`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #0f172a, #1e293b);
  overflow: hidden;
`;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
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

  // Sample coupon data for background
  const coupons = [
    { code: "SUMMER25", color: "#FF6B6B" },
    { code: "FREEDOM25", color: "#FFEEAD" },
    { code: "BLACKFRIDAY", color: "#96CEB4" },
    { code: "SPRING50", color: "#4ECDC4" },
    { code: "WINTER30", color: "#45B7D1" },
    { code: "FALL25", color: "#96CEB4" },
    { code: "FLASH20", color: "#FFEEAD" }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post(`${BACKEND_URL}/adminlogin`, { email, password });
    console.log(response);
    if (response.status === 200){
        localStorage.setItem('token', response.data.token);
        console.log(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/admin');
    }else {
        navigate('/login')
    }
  };

  return (
    <LoginContainer>
        <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-[5000ms]" style={{ backgroundImage: `url(${nightSkyImage})`, opacity: isDayTime ? 0 : 1 }} />

        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDayTime ? 'opacity-0' : 'opacity-100'}`}>
            {stars.map(star => (
                <div key={star.id} className="absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle" style={{ left: `${star.x}%`, top: `${star.y}%`, animationDuration: `${star.duration}s` }} />
            ))}
        </div>
      {coupons.map((coupon, index) => (
        <FloatingCoupon
          key={index}
          color={coupon.color}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${index * 2}s`,
          }}
        >
          {coupon.code}
        </FloatingCoupon>
      ))}

      {/* Login Form */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 p-8 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </LoginContainer>
  );
}