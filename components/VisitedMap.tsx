"use client";

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom minimalist heart icon for markers
const createHeartIcon = () => {
  return L.divIcon({
    html: `<div style="
      background: #ec4899;
      border: 2px solid #fff;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(236,72,153,0.25);
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>`,
    className: 'custom-heart-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface Pin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  description?: string;
  createdAt: any;
}

interface VisitedMapProps {
  initialPins: Pin[];
  savePin: (pinData: { lat: number; lng: number; label: string; description?: string }) => Promise<Pin>;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function VisitedMap({ initialPins, savePin }: VisitedMapProps) {
  const [pins, setPins] = useState<Pin[]>(initialPins);
  const [clickedPosition, setClickedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPinLabel, setNewPinLabel] = useState('');
  const [newPinDescription, setNewPinDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleMapClick = (lat: number, lng: number) => {
    setClickedPosition({ lat, lng });
    setIsDialogOpen(true);
  };

  const handleSavePin = async () => {
    if (!clickedPosition || !newPinLabel.trim()) return;

    setIsSaving(true);
    try {
      const newPin = await savePin({
        lat: clickedPosition.lat,
        lng: clickedPosition.lng,
        label: newPinLabel.trim(),
        description: newPinDescription.trim() || undefined,
      });

      setPins(prev => [newPin, ...prev]);
      setNewPinLabel('');
      setNewPinDescription('');
      setIsDialogOpen(false);
      setClickedPosition(null);
    } catch (error) {
      console.error('Error saving pin:', error);
      alert('Failed to save pin. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNewPinLabel('');
    setNewPinDescription('');
    setIsDialogOpen(false);
    setClickedPosition(null);
  };

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={[-26.2041, 28.0473] as L.LatLngExpression}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />
        
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng] as L.LatLngExpression}
            icon={createHeartIcon()}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {pin.label}
                </h3>
                {pin.description && (
                  <p className="text-gray-600 text-sm mb-2">
                    {pin.description}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {pin.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently added'}
                </p>
              </div>
            </Popup>
            {/* Place name label below the marker */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '100%',
                transform: 'translate(-50%, 4px)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                fontSize: '0.85rem',
                color: '#ec4899',
                fontWeight: 600,
                textShadow: '0 1px 4px #fff',
              }}
            >
              {pin.label}
            </div>
          </Marker>
        ))}
      </MapContainer>

      {/* Add Pin Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Memory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin-label">Place Name *</Label>
              <Input
                id="pin-label"
                value={newPinLabel}
                onChange={(e) => setNewPinLabel(e.target.value)}
                placeholder="Enter the name of this place..."
                onKeyPress={(e) => e.key === 'Enter' && handleSavePin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin-description">Description (Optional)</Label>
              <Input
                id="pin-description"
                value={newPinDescription}
                onChange={(e) => setNewPinDescription(e.target.value)}
                placeholder="What happened here? Any special memories?"
                onKeyPress={(e) => e.key === 'Enter' && handleSavePin()}
              />
            </div>
            {clickedPosition && (
              <p className="text-sm text-gray-500">
                Location: {clickedPosition.lat.toFixed(6)}, {clickedPosition.lng.toFixed(6)}
              </p>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button 
                onClick={handleSavePin} 
                disabled={!newPinLabel.trim() || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Memory'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 