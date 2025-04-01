"use client";

import { useState, useEffect } from "react";
import { Heart, ChevronRight, ChevronLeft, Upload, Lock, Eye, EyeOff, Loader2, MessageSquare } from "lucide-react";
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { playfair, poiretOne } from './fonts';
import { useRouter } from 'next/navigation';

const messages = [
  "Hey baby",
  "I hope youre doing well",
  "I miss you so much",
  "I cant wait to see you again",
  "I keep going back to look at your pictures",
  "It always makes me smile so much",
  "I need like a 20 hour long hug",
  "Ok maybe 21",
  "Or more",
  "But anyways",
  "I hope i can see you again soon",
  "My heart hurts without you",
  "Your presence brings me so much joy",
  "Also I added something new for you",
  "Press on the lock icon",
  "Its for you to read in private",
  "I hope you enjoy it babygirl",
  "I love you"
];

const loveTranslations = [
  { text: "I love you", language: "English" },
  { text: "我爱你", language: "Chinese" },
  { text: "मैं तुमसे प्यार करता हूँ", language: "Hindi" },
  { text: "Te amo", language: "Spanish" },
  { text: "Je t'aime", language: "French" },
  { text: "أحبك", language: "Arabic" },
  { text: "আমি তোমায় ভালোবাসি", language: "Bengali" },
  { text: "Я тебя люблю", language: "Russian" },
  { text: "Eu te amo", language: "Portuguese" },
  { text: "Aku cinta kamu", language: "Indonesian" },
  { text: "میں تم سے محبت کرتا ہوں", language: "Urdu" },
  { text: "Ich liebe dich", language: "German" },
  { text: "愛してる", language: "Japanese" },
  { text: "Nakupenda", language: "Swahili" },
  { text: "मी तुझ्यावर प्रेम करतो", language: "Marathi" },
  { text: "నేను నిన్ను ప్రేమిస్తున్నాను", language: "Telugu" },
  { text: "Seni seviyorum", language: "Turkish" },
  { text: "நான் உன்னை காதலிக்கிறேன்", language: "Tamil" },
  { text: "Anh yêu em", language: "Vietnamese" },
  { text: "사랑해", language: "Korean" },
  { text: "Ti amo", language: "Italian" },
  { text: "Kocham cię", language: "Polish" },
  { text: "Я тебе люблю", language: "Ukrainian" },
  { text: "دوستت دارم", language: "Persian" },
  { text: "Te iubesc", language: "Romanian" },
  { text: "Ina son ku", language: "Hausa" },
  { text: "Σ' αγαπώ", language: "Greek" },
  { text: "Miluji tě", language: "Czech" },
  { text: "Jag älskar dig", language: "Swedish" },
  { text: "Szeretlek", language: "Hungarian" },
  { text: "Я цябе кахаю", language: "Belarusian" },
  { text: "Обичам те", language: "Bulgarian" },
  { text: "Jeg elsker dig", language: "Danish" },
  { text: "Rakastan sinua", language: "Finnish" },
  { text: "Jeg elsker deg", language: "Norwegian" },
  { text: "Milujem ťa", language: "Slovak" },
  { text: "Volim te", language: "Croatian" },
  { text: "Волим те", language: "Serbian" },
  { text: "Volim te", language: "Bosnian" },
  { text: "Ljubim te", language: "Slovenian" },
  { text: "Aš tave myliu", language: "Lithuanian" },
  { text: "Es tevi mīlu", language: "Latvian" },
  { text: "Ma armastan sind", language: "Estonian" },
  { text: "Ég elska þig", language: "Icelandic" },
  { text: "Inħobbok", language: "Maltese" },
  { text: "Saya cinta padamu", language: "Malay" },
  { text: "Mahal kita", language: "Filipino" },
  { text: "म तिमीलाई माया गर्छु", language: "Nepali" },
  { text: "මම ඔයාට ආදරෙයි", language: "Sinhala" },
  { text: "ខ្ញុំស្រឡាញ់អ្នក", language: "Khmer" },
  { text: "ຂ້ອຍຮັກເຈົ້າ", language: "Lao" },
  { text: "ငါနင့်ကိုချစ်တယ်", language: "Burmese" },
  { text: "እወድሃለሁ", language: "Amharic" },
  { text: "Waan ku jeclahay", language: "Somali" },
  { text: "Mo nifẹ rẹ", language: "Yoruba" },
  { text: "A hụrụ m gị n'anya", language: "Igbo" },
  { text: "Ngiyakuthanda", language: "Zulu" },
  { text: "Ndiyakuthanda", language: "Xhosa" },
  { text: "Ek het jou lief", language: "Afrikaans" },
  { text: "Të dua", language: "Albanian" },
  { text: "Те сакам", language: "Macedonian" },
  { text: "مەن سىنى سۆيىمەن", language: "Uyghur" },
  { text: "Мен сені жақсы көремін", language: "Kazakh" },
  { text: "Seni sevaman", language: "Uzbek" },
  { text: "Men seni söýýärin", language: "Turkmen" },
  { text: "Ман туро дӯст медорам", language: "Tajik" },
  { text: "زه له تا مینه لرم", language: "Pashto" },
  { text: "Ez hej te dikim", language: "Kurdish" },
  { text: "Səni sevirəm", language: "Azerbaijani" },
  { text: "მე შენ მიყვარხარ", language: "Georgian" },
  { text: "Ես քեզ սիրում եմ", language: "Armenian" },
  { text: "אני אוהב אותך", language: "Hebrew" },
  { text: "ܐܚܒܟ", language: "Syriac" },
  { text: "Maite zaitut", language: "Basque" },
  { text: "Quérote", language: "Galician" },
  { text: "T'estimo", language: "Catalan" },
  { text: "Tha gaol agam ort", language: "Scottish" },
  { text: "Tá grá agam duit", language: "Irish" },
  { text: "Rwy'n dy garu di", language: "Welsh" },
  { text: "Me az kar", language: "Breton" },
  { text: "My a'th kar", language: "Cornish" },
  { text: "Ech hun dech gaer", language: "Luxembourgish" },
  { text: "Ik hâld fan dy", language: "Frisian" },
  { text: "Jau am tai", language: "Romansh" },
  { text: "Mi amas vin", language: "Esperanto" },
  { text: "Mwen renmen ou", language: "Haitian" },
  { text: "Mi ta stimabo", language: "Papiamento" },
  { text: "Ou te alofa ia te oe", language: "Samoan" },
  { text: "Kei te aroha au ki a koe", language: "Māori" },
  { text: "Au domoni iko", language: "Fijian" },
  { text: "Ofa atu", language: "Tongan" },
  { text: "Ua here vau ia oe", language: "Tahitian" },
  { text: "Tiako ianao", language: "Malagasy" },
  { text: "Ndimakukonda", language: "Chichewa" },
  { text: "Ndinokuda", language: "Shona" },
  { text: "Ke a go rata", language: "Tswana" },
  { text: "Ke a u rata", language: "Sesotho" },
  { text: "Siin jaaladha", language: "Oromo" },
  { text: "Kuyayki", language: "Quechua" },
  { text: "Rohayhu", language: "Guarani" }
];

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
}

export default function Home() {
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentLoveIndex, setCurrentLoveIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    days: 0,
    hours: 0,
    minutes: 0
  });
  const [prevTimeElapsed, setPrevTimeElapsed] = useState<TimeElapsed>(timeElapsed);
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messagePassword, setMessagePassword] = useState("");
  const [messagePasswordError, setMessagePasswordError] = useState(false);
  const [showMessagePassword, setShowMessagePassword] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const imagesRef = ref(storage, 'images');
        const result = await listAll(imagesRef);
        
        if (result.items.length === 0) {
          console.log('No images found in Firebase storage');
          setImages([]);
          setIsLoading(false);
          return;
        }

        const urlPromises = result.items.map(async (imageRef) => {
          try {
            return await getDownloadURL(imageRef);
          } catch (error) {
            console.error(`Error getting URL for ${imageRef.name}:`, error);
            return null;
          }
        });

        const urls = (await Promise.all(urlPromises)).filter((url): url is string => url !== null);
        
        if (urls.length === 0) {
          console.log('Failed to get any valid image URLs');
          setImages([]);
        } else {
          setImages(urls);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Preload the next image
  useEffect(() => {
    if (images.length === 0) return;
    
    const nextIndex = (currentImageIndex + 1) % images.length;
    const nextImage = images[nextIndex];
    
    if (!loadedImages.has(nextImage)) {
      const img = document.createElement('img');
      img.src = nextImage;
      img.onload = () => {
        setLoadedImages(prev => new Set(Array.from(prev).concat([nextImage])));
      };
    }
  }, [currentImageIndex, images, loadedImages]);

  useEffect(() => {
    const startDate = new Date("2023-11-25T00:14:00");

    // Calculate initial time immediately
    const calculateTime = () => {
      const now = new Date();
      const difference = now.getTime() - startDate.getTime();

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60)
      };
    };

    // Set initial time
    const initialTime = calculateTime();
    setTimeElapsed(initialTime);
    setPrevTimeElapsed(initialTime);

    // Update every minute
    const timer = setInterval(() => {
      const newTimeElapsed = calculateTime();
      
      // Only update if values have actually changed
      if (JSON.stringify(newTimeElapsed) !== JSON.stringify(timeElapsed)) {
        setPrevTimeElapsed(timeElapsed);
        setTimeElapsed(newTimeElapsed);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [timeElapsed]);

  useEffect(() => {
    const translationTimer = setInterval(() => {
      setCurrentLoveIndex((prev) => (prev + 1) % loveTranslations.length);
    }, 3000);

    return () => clearInterval(translationTimer);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;

    const imageTimer = setInterval(() => {
      nextImage();
    }, 3000);

    return () => clearInterval(imageTimer);
  }, [autoPlay, currentImageIndex]);

  const nextMessage = () => {
    setCurrentMessage((prev) => (prev + 1) % messages.length);
  };

  const previousMessage = () => {
    setCurrentMessage((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const nextImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, 500);
  };

  const previousImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, 500);
  };

  const goToImage = (index: number) => {
    if (index === currentImageIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  const handleUpload = async () => {
    const validPasswords = ["0725817895", "0659315492"];
    if (validPasswords.includes(password) && selectedFile) {
      try {
        setIsUploading(true);
        // Create a reference to the file in Firebase Storage with timestamp to ensure uniqueness
        const timestamp = Date.now();
        const fileName = `${timestamp}_${selectedFile.name}`;
        const storageRef = ref(storage, `images/${fileName}`);
        
        // Upload the file
        await uploadBytes(storageRef, selectedFile);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        // Add the new image URL to the images array if it's not already there
        if (!images.includes(downloadURL)) {
          const newImages = [...images, downloadURL];
          setImages(newImages);
        }
        
        // Reset the form
        setUploadDialogOpen(false);
        setPassword("");
        setSelectedFile(null);
        setPasswordError(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setPasswordError(true);
      } finally {
        setIsUploading(false);
      }
    } else {
      setPasswordError(true);
    }
  };

  const handleImageError = () => {
    setImageLoadError(true);
    console.error("Failed to load image:", images[currentImageIndex]);
  };

  const handleMessageAccess = () => {
    const validPasswords = ["0725817895", "0659315492"];
    if (validPasswords.includes(messagePassword)) {
      setMessageDialogOpen(false);
      setMessagePassword("");
      setMessagePasswordError(false);
      window.location.href = '/messages';
    } else {
      setMessagePasswordError(true);
    }
  };

  const TimeUnit = ({ value, label, prevValue }: { value: number; label: string; prevValue: number }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const formattedValue = String(value).padStart(2, '0');
    const formattedPrevValue = String(prevValue).padStart(2, '0');

    useEffect(() => {
      if (prevValue !== value) {
        setIsAnimating(true);
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 600); // Match this with the CSS animation duration
        return () => clearTimeout(timer);
      }
    }, [value, prevValue]);

    return (
      <div className="bg-pink-50 rounded-lg p-2 transform hover:scale-105 transition-transform duration-200 hover:shadow-lg">
        <div className={`${playfair.className} text-2xl font-bold text-gray-800 h-8 relative overflow-hidden`}>
          <div 
            key={value} 
            className={`absolute inset-0 flex items-center justify-center ${isAnimating ? 'number-slide' : ''}`}
            style={{ 
              transform: isAnimating ? undefined : 'translateY(0)',
              opacity: isAnimating ? undefined : 1
            }}
          >
            {formattedValue}
          </div>
        </div>
        <div className="text-sm text-gray-600 text-center mt-1">{label}</div>
      </div>
    );
  };

  return (
    <main className={`min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4 flex flex-col items-center justify-center ${poiretOne.variable}`}>
      {/* Welcome Heading */}
      <div className={`${playfair.className} text-5xl md:text-6xl text-pink-600 mb-8 animate-fade-in text-center leading-relaxed`}>
      If I know what love is, it is because of you
      </div>

      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Love Counter */}
        <div className="p-6">
          <h2 className={`${playfair.className} text-2xl text-center mb-4 text-gray-800`}>Our Time Together</h2>
          <div className="grid grid-cols-3 gap-4">
            <TimeUnit value={timeElapsed.days} label="Days" prevValue={prevTimeElapsed.days} />
            <TimeUnit value={timeElapsed.hours} label="Hours" prevValue={prevTimeElapsed.hours} />
            <TimeUnit value={timeElapsed.minutes} label="Minutes" prevValue={prevTimeElapsed.minutes} />
          </div>
        </div>

        {/* Love Translations */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            
            <h2 className={`${playfair.className} text-2xl text-gray-800`}>
              {loveTranslations[currentLoveIndex].text}
            </h2>
            
          </div>
          <div className={`${poiretOne.className} text-sm text-gray-600`}>
            {loveTranslations[currentLoveIndex].language}
          </div>
        </div>

        {/* Message Carousel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl min-h-[200px] flex flex-col transform hover:translate-y-[-5px] transition-all duration-300 hover:shadow-2xl">
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <p key={currentMessage} className={`${playfair.className} text-xl text-gray-800 animate-fade-in tracking-tight`}>
              {messages[currentMessage]}
            </p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={previousMessage}
              className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-sm text-gray-500">
              {currentMessage + 1} / {messages.length}
            </div>
            <button
              onClick={nextMessage}
              className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Image Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:translate-y-[-5px] transition-all duration-300 hover:shadow-2xl">
          <div className="relative">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                <div className="text-gray-500 ml-3">Loading images...</div>
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => {
                  const isLarge = index % 5 === 0;
                  const gridClass = isLarge ? 'col-span-2 row-span-2' : '';
                  
                  return (
                    <div 
                      key={image} 
                      className={`relative group ${gridClass} rounded-lg overflow-hidden`}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={image}
                          alt={`Love moment ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          quality={75}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => window.open(image, '_blank')}
                          className="bg-white/80 text-pink-600 p-2 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-gray-500 mb-4">images failed to load, not the vibes :(</div>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Add Images
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Fixed buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
          <button
            onClick={() => setMessageDialogOpen(true)}
            className="p-4 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Lock className="w-6 h-6" />
          </button>
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="p-4 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Upload className="w-6 h-6" />
          </button>
        </div>

        {/* Message Password Dialog */}
        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Special Messages</DialogTitle>
              <DialogDescription>
                Enter the password to access special messages.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="messagePassword">Password</Label>
                <div className="relative">
                  <Input
                    id="messagePassword"
                    type={showMessagePassword ? "text" : "password"}
                    value={messagePassword}
                    onChange={(e) => {
                      setMessagePassword(e.target.value);
                      setMessagePasswordError(false);
                    }}
                    className={messagePasswordError ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowMessagePassword(!showMessagePassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showMessagePassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {messagePasswordError && (
                  <p className="text-sm text-red-500">
                    Incorrect password
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMessageDialogOpen(false);
                    setMessagePassword("");
                    setMessagePasswordError(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleMessageAccess}>
                  Access
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>
                Type the password to upload a new image.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(false);
                    }}
                    className={passwordError ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500">
                    {selectedFile ? "Wrong password domcop" : "Choose a picture and type the password"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Image</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadDialogOpen(false);
                    setPassword("");
                    setSelectedFile(null);
                    setPasswordError(false);
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}