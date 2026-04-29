import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  doc, 
  updateDoc,
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { AppState, MealRecord, MedicationRecord, SymptomRecord, WeightRecord } from '../types';
import { useAuth } from '../context/AuthContext';

export function useAppState() {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>({
    meals: [],
    medications: [],
    symptoms: [],
    weights: [],
    userName: 'Usuário',
    medicationSchedule: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      if (isLoaded) {
         setState({
          meals: [],
          medications: [],
          symptoms: [],
          weights: [],
          userName: 'Usuário',
          medicationSchedule: null,
        });
      }
      return;
    }

    const userId = user.uid;
    setState(s => ({ ...s, userName: user.displayName || 'Usuário' }));

    // Real-time listeners
    const unsubUser = onSnapshot(doc(db, 'users', userId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setState(s => ({ 
          ...s, 
          medicationSchedule: data.medicationSchedule || null,
          userName: data.displayName || user.displayName || 'Usuário'
        }));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `users/${userId}`));

    const unsubMeals = onSnapshot(
      query(collection(db, 'users', userId, 'meals'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const meals = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MealRecord));
        setState(s => ({ ...s, meals }));
      },
      (err) => handleFirestoreError(err, OperationType.GET, `users/${userId}/meals`)
    );

    const unsubMeds = onSnapshot(
      query(collection(db, 'users', userId, 'medications'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const medications = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MedicationRecord));
        setState(s => ({ ...s, medications }));
      },
      (err) => handleFirestoreError(err, OperationType.GET, `users/${userId}/medications`)
    );

    const unsubSymptoms = onSnapshot(
      query(collection(db, 'users', userId, 'symptoms'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const symptoms = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SymptomRecord));
        setState(s => ({ ...s, symptoms }));
      },
      (err) => handleFirestoreError(err, OperationType.GET, `users/${userId}/symptoms`)
    );

    const unsubWeights = onSnapshot(
      query(collection(db, 'users', userId, 'weights'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const weights = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as WeightRecord));
        setState(s => ({ ...s, weights }));
      },
      (err) => handleFirestoreError(err, OperationType.GET, `users/${userId}/weights`)
    );

    setIsLoaded(true);

    return () => {
      unsubUser();
      unsubMeals();
      unsubMeds();
      unsubSymptoms();
      unsubWeights();
    };
  }, [user]);

  const addMeal = async (meal: Omit<MealRecord, 'id' | 'timestamp'>) => {
    if (!user) return;
    const path = `users/${user.uid}/meals`;
    try {
      await addDoc(collection(db, path), {
        ...meal,
        timestamp: Date.now(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const addMedication = async (med: Omit<MedicationRecord, 'id' | 'timestamp'>) => {
    if (!user) return;
    const path = `users/${user.uid}/medications`;
    try {
      await addDoc(collection(db, path), {
        ...med,
        timestamp: Date.now(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const addSymptom = async (symptom: Omit<SymptomRecord, 'id' | 'timestamp'>) => {
    if (!user) return;
    const path = `users/${user.uid}/symptoms`;
    try {
      await addDoc(collection(db, path), {
        ...symptom,
        timestamp: Date.now(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const addWeight = async (value: number) => {
    if (!user) return;
    const path = `users/${user.uid}/weights`;
    try {
      await addDoc(collection(db, path), {
        value,
        timestamp: Date.now(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const setMedicationSchedule = async (schedule: AppState['medicationSchedule']) => {
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, path), {
        medicationSchedule: schedule
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  return {
    state,
    addMeal,
    addMedication,
    addSymptom,
    addWeight,
    setMedicationSchedule,
  };
}
