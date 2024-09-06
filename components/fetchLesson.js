import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export async function fetchLessonFromFirebase(lessonName) {
  try {
    const lessonsRef = collection(db, 'lessons');
    const q = query(lessonsRef, where("name", "==", lessonName));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const lessonDoc = querySnapshot.docs[0];
      const lessonData = lessonDoc.data();
      return {
        id: lessonDoc.id,
        name: lessonName,
        title: lessonData.title || '',
        content: lessonData.content || '',
        resources: lessonData.resources || []
      };
    } else {
      console.log("No such lesson!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching lesson: ", error);
    throw error;
  }
}