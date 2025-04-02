"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playfair, poiretOne } from '../fonts';
import { useRouter } from 'next/navigation';

const specialMessages = [
  "A special message for my pretty little slut",
  "Every inch of you belongs to me",
  "My good girl, always ready to please",
  "I love the way you surrender to me without hesitation",
  "No further thoughts, just obedience and pleasure",
  "Kneel, open wide, and wait...",
  "Just the way ill train you",
  "The marks ill leave on your skin will remind you exactly who you belong to",
  "I want you to crave my control just as much as i crave owning you",
  "I want you to be my little cumslut",
  "I want you to be ready to taste every drop I have for you",
  "And be ready to be a perfect canvas for daddy",
  "Oh how id love to paint on your perfectly slutty body",
  "I will be the only one to undress you",
  "Whenever I want, and youll listen like the good girl you are for me",
  "Get on your knees and make daddy proud",
  "Ill make sure you understand every instruction i give you",
  "And ill make sure its met with more passion and aggression",
  "I hope my pretty little slut understands that",
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