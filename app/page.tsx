"use client";

import { useState, useEffect } from "react";
import { Heart, ChevronRight, ChevronLeft, Upload, Lock } from "lucide-react";
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { playfair, poiretOne } from './fonts';

const messages = [
  "Hello Baby",
  "Just wanted to tell you",
  "That im working on some cool stuff for this site",
  "I will be posting pictures of my wiener here",
  "Jokes jokes",
  "Unless...",
  "See you getting excited for nothing",
  "But anyways",
  "Just a reminder",
  "That i love you more than you love me",
  "Yeah i'd like to see you counter that",
  "You cant",
  "So i win",
  "Get destroyed",
  "Talking about destroyed",
  "Cant wait to destroy dat ass",
  "Not even joking",
  "You give me too much attitude",
  "Its about time i give you a good pounding",
  "Make the attitude drip down your thighs",
  "Im serious",
  "Ok but fr",
  "I miss you mami",
  "Cant wait to see you again",
  "Hope you enjoy your off day tomorrow",
  "I love you always",
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

export default function Home() {
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
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [prevTimeElapsed, setPrevTimeElapsed] = useState(timeElapsed);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = ref(storage, 'images');
        const result = await listAll(imagesRef);
        const urlPromises = result.items.map(imageRef => getDownloadURL(imageRef));
        const urls = await Promise.all(urlPromises);
        setImages(urls);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const startDate = new Date("2023-11-25T00:14:00");

    const timer = setInterval(() => {
      const now = new Date();
      const difference = now.getTime() - startDate.getTime();

      setPrevTimeElapsed(timeElapsed);
      setTimeElapsed({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeElapsed]);

  useEffect(() => {
    const translationTimer = setInterval(() => {
      setCurrentLoveIndex((prev) => (prev + 1) % loveTranslations.length);
    }, 4500);

    return () => clearInterval(translationTimer);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;

    const imageTimer = setInterval(() => {
      nextImage();
    }, 5000);

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
    if (password === "admin" && selectedFile) {
      try {
        // Create a reference to the file in Firebase Storage
        const storageRef = ref(storage, `images/${selectedFile.name}`);
        
        // Upload the file
        await uploadBytes(storageRef, selectedFile);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        // Add the new image URL to the images array
        const newImages = [...images, downloadURL];
        setImages(newImages);
        
        // Reset the form
        setUploadDialogOpen(false);
        setPassword("");
        setSelectedFile(null);
        setPasswordError(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setPasswordError(true);
      }
    } else {
      setPasswordError(true);
    }
  };

  const TimeUnit = ({ value, label, prevValue }: { value: number; label: string; prevValue: number }) => (
    <div className="bg-pink-50 rounded-lg p-2 transform hover:scale-105 transition-transform duration-200 hover:shadow-lg">
      <div className={`${playfair.className} text-2xl font-bold text-gray-800`}>
        <span className={prevValue !== value ? "number-animate block" : ""}>
          {value}
        </span>
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );

  return (
    <main className={`min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4 flex flex-col items-center justify-center ${poiretOne.variable}`}>
      {/* Welcome Heading */}
      <div className={`${playfair.className} text-5xl md:text-6xl text-pink-600 mb-8 animate-fade-in text-center leading-relaxed`}>
        Something a little different for us ❤️
      </div>

      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Love Counter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:translate-y-[-5px] transition-all duration-300 hover:shadow-2xl">
          <h2 className={`${playfair.className} text-2xl text-center mb-4 text-gray-800`}>Our Time Together</h2>
          <div className="grid grid-cols-4 gap-4">
            <TimeUnit value={timeElapsed.days} label="Days" prevValue={prevTimeElapsed.days} />
            <TimeUnit value={timeElapsed.hours} label="Hours" prevValue={prevTimeElapsed.hours} />
            <TimeUnit value={timeElapsed.minutes} label="Minutes" prevValue={prevTimeElapsed.minutes} />
            <TimeUnit value={timeElapsed.seconds} label="Seconds" prevValue={prevTimeElapsed.seconds} />
          </div>
        </div>

        {/* Love Translations */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:translate-y-[-5px] transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-6 h-6 text-pink-500" />
              <h2 className={`${playfair.className} text-2xl text-gray-800`}>
                {loveTranslations[currentLoveIndex].text}
              </h2>
              <Heart className="w-6 h-6 text-pink-500" />
            </div>
            <div className={`${poiretOne.className} text-sm text-gray-500`}>
              {loveTranslations[currentLoveIndex].language}
            </div>
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

        {/* Image Slideshow */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:translate-y-[-5px] transition-all duration-300 hover:shadow-2xl overflow-hidden"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          <div className="relative">
            {isLoading ? (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">Loading images...</div>
              </div>
            ) : images.length > 0 ? (
              <>
                <div 
                  className={`relative aspect-[16/9] rounded-lg overflow-hidden ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  } transition-opacity duration-500 ease-in-out`}
                >
                  <Image
                    src={images[currentImageIndex]}
                    alt="Love moments"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-pink-600 hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-pink-600 hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setUploadDialogOpen(true)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 text-pink-600 hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <Upload className="w-5 h-5" />
                </button>

                {images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? 'bg-pink-500 w-4'
                            : 'bg-pink-200 hover:bg-pink-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">No images available</div>
                <button
                  onClick={() => setUploadDialogOpen(true)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 text-pink-600 hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>
                Please enter the password to upload a new image.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(false);
                    }}
                    className={passwordError ? "border-red-500" : ""}
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500">
                    {selectedFile ? "Invalid password" : "Please select a file and enter the correct password"}
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
                >
                  Cancel
                </Button>
                <Button onClick={handleUpload}>Upload</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}