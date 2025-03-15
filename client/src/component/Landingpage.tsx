import { useEffect, useState } from 'react';
import styled from 'styled-components';
import nightSkyImage from '../assets/pix.png';

const LandingContainer = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    ${props => props.$isDayTime ? 
    'to bottom,rgb(112, 201, 236), #E0FFFF' : 
    'to bottom, #0B0B3B, #1A1A3A'}
  );
  transition: background 3s ease-in-out;
`;

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

const StarField = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${props => props.$isDayTime ? 0 : 1};
  transition: opacity 3s ease-in-out;
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: white;
  border-radius: 50%;
  animation: twinkle ${props => props.$duration}s ease-in-out infinite;

  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 1; }
  }
`;

const ClaimButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: white;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
`;

const Title = styled.h1`
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 3rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

export default function LandingPage() {
  const [isDayTime, setIsDayTime] = useState(false);
  const [stars, setStars] = useState<{ id: number; x: number; y: number; duration: number }[]>([]);

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
    <LandingContainer $isDayTime={isDayTime}>
      <BackgroundImage 
        $isDayTime={isDayTime} 
        $backgroundImage={nightSkyImage}
        />
        <Title>Welcome to The Sales Studio</Title>
      <StarField $isDayTime={isDayTime}>
        {stars.map(star => (
          <Star
            key={star.id}
            $duration={star.duration}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`
            }}
          />
        ))}
      </StarField>
      <ClaimButton>
        Claim Your Coupon
      </ClaimButton>
    </LandingContainer>
  );
}