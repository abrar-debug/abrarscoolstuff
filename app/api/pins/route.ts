import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

// GET - Fetch all pins
export async function GET() {
  try {
    const pinsRef = collection(db, 'pins');
    const q = query(pinsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const pins = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(pins);
  } catch (error) {
    console.error('Error fetching pins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pins' },
      { status: 500 }
    );
  }
}

// POST - Add a new pin
export async function POST(request: NextRequest) {
  try {
    const { lat, lng, label, description } = await request.json();

    if (!lat || !lng || !label) {
      return NextResponse.json(
        { error: 'Missing required fields: lat, lng, label' },
        { status: 400 }
      );
    }

    const pinsRef = collection(db, 'pins');
    const newPin = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      label,
      description: description || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(pinsRef, newPin);
    
    return NextResponse.json({
      id: docRef.id,
      ...newPin
    });
  } catch (error) {
    console.error('Error adding pin:', error);
    return NextResponse.json(
      { error: 'Failed to add pin' },
      { status: 500 }
    );
  }
} 