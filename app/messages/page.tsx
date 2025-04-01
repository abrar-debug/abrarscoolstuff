"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playfair, poiretOne } from '../fonts';
import { useRouter } from 'next/navigation';

const specialMessages = [
  "I hope youre alone",
  "I just wanted to tell you how badly i want you",
  "You turn me on so much",
  "You make me think of the most unholiest thoughts",
  "And how id love to make you my little cumslut",
  "I wanna make you scream into the pillow",
  "While i pound you from the back",
  "And pull your hair",
  "Im gonna make sure that i fill you up",
  "Until its dripping down your thighs",
  "Ill fuck you until you cant feel your legs",
  "And ill make sure that you feel like the little slut you are",
  "Youre going to take every inch of me like a good girl",
  "And any complaints will be ignored",
  "You wont even be able to make out any words",
  "Because ill shove it down your throat",
  "I only wanna hear choking and gagging from you",
  "I hope you understood that slut"
];

export default function Messages() {
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextMessage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMessage((prev) => (prev + 1) % specialMessages.length);
      setIsAnimating(false);
    }, 300);
  };

  const previousMessage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMessage((prev) => (prev - 1 + specialMessages.length) % specialMessages.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-black p-4 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          onClick={goToHome}
          className="flex items-center text-pink-400 hover:text-pink-300 hover:bg-zinc-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(244,114,182,0.1),transparent_70%)]"></div>
        <div className="absolute bottom-0 right-0 w-4/5 h-4/5 bg-[radial-gradient(circle_at_80%_80%,rgba(244,114,182,0.15),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className={`${playfair.className} text-4xl md:text-5xl text-pink-400 mb-12 text-center leading-relaxed font-bold`}>
          For my good girl
        </div>

        <div className="container mx-auto max-w-2xl">
          <div className="relative bg-zinc-900/70 backdrop-blur-md rounded-xl p-8 shadow-[0_0_25px_rgba(244,114,182,0.3)] min-h-[300px] flex flex-col transform hover:translate-y-[-5px] transition-all duration-500 border border-pink-500/20">
            <div className="flex-1 flex items-center justify-center text-center p-4">
              <p 
                key={currentMessage} 
                className={`${playfair.className} text-xl md:text-2xl text-pink-50 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-all duration-500 tracking-tight italic`}
              >
                {specialMessages[currentMessage]}
              </p>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={previousMessage}
                className="p-2 rounded-full bg-zinc-800 text-pink-400 hover:bg-zinc-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_10px_rgba(244,114,182,0.3)]"
                disabled={isAnimating}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="text-sm text-pink-300/70">
                {currentMessage + 1} / {specialMessages.length}
              </div>
              <button
                onClick={nextMessage}
                className="p-2 rounded-full bg-zinc-800 text-pink-400 hover:bg-zinc-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_10px_rgba(244,114,182,0.3)]"
                disabled={isAnimating}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 