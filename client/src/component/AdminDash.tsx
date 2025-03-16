import { StarBackground } from './StarBackground';
import { Sidebar } from './Sidebar';
import { DataTable } from './DataTable';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import nightSkyImage from '../assets/pix.png';
import { BACKEND_URL } from '../config';


const couponData = [
  { id: 1, user: "John Doe", coupon: "STAR50", claimed: "2024-02-28", status: "Active" },
  { id: 2, user: "Jane Smith", coupon: "GALAXY25", claimed: "2024-02-27", status: "Used" },
  { id: 3, user: "Mike Johnson", coupon: "COSMOS75", claimed: "2024-02-26", status: "Expired" },
];


const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  opacity: ${props => props.$isDayTime ? 0 : 1};
  transition: opacity ${props => props.$isDayTime ? '12s' : '5s'} ease-in-out;
\
`;

function AdminDash() {
  const [isDayTime, setIsDayTime] = useState(false);
  const [stars, setStars] = useState<{ id: number; x: number; y: number; duration: number }[]>([]);
  const [toggle, setToggle] = useState(false);

  

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
  
  if(!toggle){
    return (
      <div className="flex min-w-screen min-h-screen bg-gray-950">
        <BackgroundImage 
          $isDayTime={isDayTime} 
          $backgroundImage={nightSkyImage}
          />
        <div className='relative'><Sidebar /></div>
        <StarBackground />
        
        <main className="flex-1 p-8">
          <div 
            className="h-48 mb-8 rounded-xl bg-cover bg-center relative overflow-hidden"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80")'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent">
              <div className="p-8">
                <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, Admin_Name</h1>
                <p className="text-purple-200">Monitor and track the coupon management</p>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DataTable
              title="Claimed Coupons"
              columns={[
                { key: 'user', label: 'User' },
                { key: 'coupon', label: 'Coupon Code' },
                { key: 'claimed', label: 'Claimed Date' },
                { key: 'status', label: 'Status' },
              ]}
              data={couponData}
            />
            <DataTable
              title="Claimed Coupons"
              columns={[
                { key: 'user', label: 'User' },
                { key: 'coupon', label: 'Coupon Code' },
                { key: 'claimed', label: 'Claimed Date' },
                { key: 'status', label: 'Status' },
              ]}
              data={couponData}
            />
  
          </div>
        </main>
      </div>
    );
  }else {
    return (
      <div className="flex min-w-screen min-h-screen bg-gray-950">
        <BackgroundImage 
          $isDayTime={isDayTime} 
          $backgroundImage={nightSkyImage}
          />
        <div className='relative z-10'><Sidebar /></div>
        <StarBackground />
        
        <main className="flex-1 p-8">
          <div 
            className="h-48 mb-8 rounded-xl bg-cover bg-center relative overflow-hidden"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80")'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent">
              <div className="p-8">
                <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, Admin_Name</h1>
                <p className="text-purple-200">Monitor and track the coupons</p>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
          </div>
        </main>
      </div>
    );
  }
}

export default AdminDash;