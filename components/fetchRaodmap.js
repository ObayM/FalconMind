import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export async function fetchRoadmap(roadmapName) {
  try {
    const roadmapsRef = collection(db, 'roadmaps');
    const q = query(roadmapsRef, where("name", "==", roadmapName));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No matching roadmap found");
      return null;
    }

    const roadmapDoc = querySnapshot.docs[0];
    return { id: roadmapDoc.id, ...roadmapDoc.data() };
  } catch (error) {
    console.error("Error fetching roadmap: ", error);
    throw error;
  }
}