import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';

export async function storeLessonInFirebase(lessonData, lessonId = null) {
  try {
    let docRef;
    if (lessonId) {
      // Update existing lesson
      docRef = doc(db, 'lessons', lessonId);
      await setDoc(docRef, lessonData, { merge: true });
    } else {
      // Add new lesson
      docRef = await addDoc(collection(db, 'lessons'), lessonData);
    }
    console.log("Lesson stored with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error storing lesson: ", error);
    throw error;
  }
}
