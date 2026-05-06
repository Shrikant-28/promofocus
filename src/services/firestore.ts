import {
  collection,
  doc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Firestore
} from "firebase/firestore";
import { getFirebaseFirestore } from "./firebase";
import { PomodoroSession, Task, UserProfile } from "@utils/types";

const db: Firestore = getFirebaseFirestore();

export const usersCollection = collection(db, "users");
export const tasksCollection = collection(db, "tasks");
export const sessionsCollection = collection(db, "sessions");

export async function createOrUpdateUser(profile: UserProfile) {
  const userRef = doc(usersCollection, profile.id);
  await setDoc(userRef, {
    name: profile.name,
    email: profile.email,
    photoURL: profile.photoURL,
    createdAt: profile.createdAt
  }, { merge: true });
}

export async function subscribeTasks(userId: string, callback: (tasks: Task[]) => void) {
  const tasksQuery = query(tasksCollection, where("userId", "==", userId), orderBy("createdAt", "desc"));
  return onSnapshot(tasksQuery, snapshot => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Task, "id">) }));
    callback(tasks);
  });
}

export async function subscribeSessions(userId: string, callback: (sessions: PomodoroSession[]) => void) {
  const sessionsQuery = query(sessionsCollection, where("userId", "==", userId), orderBy("startTime", "desc"));
  return onSnapshot(sessionsQuery, snapshot => {
    const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<PomodoroSession, "id">) }));
    callback(sessions);
  });
}

export async function addTask(task: Omit<Task, "id">) {
  await addDoc(tasksCollection, task);
}

export async function updateTask(taskId: string, data: Partial<Task>) {
  const taskRef = doc(tasksCollection, taskId);
  await updateDoc(taskRef, data);
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(tasksCollection, taskId);
  await deleteDoc(taskRef);
}

export async function createSession(session: Omit<PomodoroSession, "id">) {
  await addDoc(sessionsCollection, {
    ...session,
    createdAt: serverTimestamp()
  });
}
