import { addDoc, collection, deleteDoc, doc, getDocs, getDoc, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase";

export type FirestoreProfile = {
  displayName: string;
  bio: string;
  location: string;
  avatar: string;
  coverPhoto: string;
  themeColor: string;
};

export type FirestorePost = {
  id: string;
  username: string;
  content: string;
  createdAt?: { seconds: number };
};

function profileReference(username: string) {
  return doc(db, "profiles", encodeURIComponent(username.trim().toLowerCase()));
}

export async function readFirestoreProfile(username: string) {
  const snapshot = await getDoc(profileReference(username));
  return snapshot.exists() ? (snapshot.data() as Partial<FirestoreProfile>) : null;
}

export async function saveFirestoreProfile(username: string, profile: FirestoreProfile) {
  await setDoc(profileReference(username), {
    ...profile,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function initializeFirestoreProfile(username: string, profile: FirestoreProfile) {
  const reference = profileReference(username);
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    await setDoc(reference, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function readFirestorePosts(username: string) {
  const postsQuery = query(collection(db, "posts"), where("username", "==", username), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map((post) => ({ id: post.id, ...post.data() })) as FirestorePost[];
}

export async function createFirestorePost(username: string, content: string) {
  const post = await addDoc(collection(db, "posts"), {
    username,
    content,
    createdAt: serverTimestamp(),
  });

  return post.id;
}

export async function deleteFirestorePost(postId: string) {
  await deleteDoc(doc(db, "posts", postId));
}

export async function readAllFirestorePosts() {
  const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map((post) => ({ id: post.id, ...post.data() })) as FirestorePost[];
}