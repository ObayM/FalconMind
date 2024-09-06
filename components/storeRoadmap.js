import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export async function storeRoadmap(roadmapData, roadmapName) {
  try {
    const docRef = await addDoc(collection(db, 'roadmaps'), {
      name: roadmapName,
      data: roadmapData
    });
    console.log("Roadmap stored with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error storing roadmap: ", error);
    throw error;
  }
}