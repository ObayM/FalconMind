import {db} from '@/firebase'
import {doc, getDoc, setDoc} from 'firebase/firestore'


export async function fetchQuizData(slug) {
    const docRef = doc(db, 'quizzes', slug);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('Quiz not found');
    }
}
  

export async function storeQuizData(slug, quizData) {
    try {
      await setDoc(doc(db, 'quizzes', slug), quizData);
      console.log('Quiz data stored successfully');
    } catch (error) {
      console.error('Error storing quiz data:', error);
      throw error;
    }
  }