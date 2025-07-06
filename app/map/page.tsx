"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playfair, poiretOne, whisper } from '../fonts';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const VisitedMap = dynamic(() => import('@/components/VisitedMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

interface Pin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  description?: string;
  createdAt: any;
}

export default function Map() {
  const router = useRouter();
  const [pins, setPins] = useState<Pin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial pins
  useEffect(() => {
    const fetchPins = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/pins');
        if (!response.ok) {
          throw new Error('Failed to fetch pins');
        }
        const data = await response.json();
        setPins(data);
      } catch (err) {
        console.error('Error fetching pins:', err);
        setError('Failed to load map data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPins();
  }, []);

  // Save a new pin
  const savePin = async (pinData: { lat: number; lng: number; label: string; description?: string }): Promise<Pin> => {
    const response = await fetch('/api/pins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pinData),
    });

    if (!response.ok) {
      throw new Error('Failed to save pin');
    }

    return response.json();
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-beige p-4 flex flex-col items-center justify-center" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)", backgroundSize: "20px 20px", backgroundColor: '#f5f5dc' }}>
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          onClick={goToHome}
          className="flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className={`${whisper.className} text-5xl md:text-6xl text-gray-800 mb-4 animate-fade-in`}>
            Our Journey Together
          </h1>
          <p className={`${poiretOne.className} text-xl text-gray-600`}>
            Every place we've been, every memory we've made
          </p>
        </div>

        {/* Map Container */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-xl transform hover:translate-y-[-5px] transition-all duration-300 border border-white/30">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading our memories...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className={`${playfair.className} text-2xl text-gray-700 mb-2`}>
                  Unable to Load Map
                </h2>
                <p className={`${poiretOne.className} text-gray-600 mb-4`}>
                  {error}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 text-center">
                <h2 className={`${playfair.className} text-2xl text-gray-700 mb-2`}>
                  Click anywhere on the map to add a memory
                </h2>
                <p className={`${poiretOne.className} text-gray-600`}>
                  {pins.length} {pins.length === 1 ? 'memory' : 'memories'} shared
                </p>
              </div>
              <VisitedMap initialPins={pins} savePin={savePin} />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="flex items-center mb-3">
              <Heart className="w-6 h-6 text-pink-500 mr-2" />
              <h3 className={`${playfair.className} text-xl text-gray-700`}>
                Add Memories
              </h3>
            </div>
            <p className={`${poiretOne.className} text-gray-600 text-sm`}>
              Click anywhere on the map to add a new memory. Share the place name and what made it special.
            </p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="flex items-center mb-3">
              <MapPin className="w-6 h-6 text-pink-500 mr-2" />
              <h3 className={`${playfair.className} text-xl text-gray-700`}>
                Explore Together
              </h3>
            </div>
            <p className={`${poiretOne.className} text-gray-600 text-sm`}>
              Click on any heart marker to see the details of that special moment we shared.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="flex items-center mb-3">
              <Heart className="w-6 h-6 text-pink-500 mr-2" />
              <h3 className={`${playfair.className} text-xl text-gray-700`}>
                Our Story
              </h3>
            </div>
            <p className={`${poiretOne.className} text-gray-600 text-sm`}>
              Every pin tells a story of our love and adventures together. Keep adding to our journey!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 