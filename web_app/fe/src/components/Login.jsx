import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RainbowButton } from "@/components/ui/rainbow-button";
import Meteors from "@/components/ui/meteors";
import Marquee from "@/components/ui/marquee";
import { firstRow, reviews, ReviewCard } from './assets/reviews';
import TypingAnimation from "@/components/ui/typing-animation";
import BlurIn from "@/components/ui/blur-in";
import { ListFade } from "./assets/ListFade";
import { salesArgs } from './assets/copywriting';
import { IconCloudDemo } from './assets/iconVloud';

const Login = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const extensionLogin = urlParams.get('extensionLogin');
    const email = urlParams.get('email');
    const name = urlParams.get('name');
    const picture = urlParams.get('picture');

    if (extensionLogin === 'true' && email && name) {
      handleExtensionLogin(email, name, picture);
    }
  }, []);

  const sendMessageToExtension = (message) => {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(import.meta.env.VITE_CHROME_EXTENSION_ID, message);
    }
  };

  const handleExtensionLogin = async (email, name, picture) => {
    try {
      const response = await axios.post(`/api/auth/google`, {
        email,
        name,
        picture
      });
      if (response.data.success) {
        sendMessageToExtension({ action: "loginComplete", status: "success" });
        navigate('/');
      } else {
        console.error('Login failed:', response.data.message);
        sendMessageToExtension({ action: "loginComplete", status: "error", error: response.data.message });
      }
    } catch (error) {
      console.error('Error during login:', error);
      sendMessageToExtension({ action: "loginComplete", status: "error", error: error.message });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `/auth/google`;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-background">
    {/* <Meteors number={30} /> */}

    <BlurIn
      word="Get Hired with Ai-Powered CVs"
      className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-900/80 bg-clip-text text-center text-7xl leading-none text-transparent dark:from-white dark:to-slate-900/100 rajdhani-regular mt-20"
    />
    
    <div className="flex-grow flex items-center justify-center w-full">
      <div className="w-full flex items-center justify-evenly">
        <ListFade title={salesArgs[0].title} items={salesArgs[0].args} direction='left' />
        <div className="flex flex-col gap-4 items-center justify-center mt-4">
          <div className = "w-[400px] flex justify-center">
        <RainbowButton onClick={handleGoogleLogin}>
          <div className="flex items-center gap-2">
            <img src="../../g.png" alt="Google Logo" className="h-6 w-6" />
            <span className='rajdhani-light'>Login with Google</span>
          </div>
        </RainbowButton>
        </div>
        <IconCloudDemo />
        </div>
        <ListFade title={salesArgs[1].title} items={salesArgs[1].args} direction='right' />
      </div>
    </div>
    <TypingAnimation
      className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-900/80 bg-clip-text text-center text-3xl leading-none text-transparent dark:from-white dark:to-slate-900/100 rajdhani-light mb-5"
      text="Tailor your resume to job requirements of top companies"
    />
    {/* Marquee at the bottom */}
    <div className="w-full overflow-hidden">
      <Marquee pauseOnHover className="[--duration:30s]">
        {reviews.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
    </div>
  
    {/* Gradient overlays */}
    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
  </div>
  );
};

export default Login;