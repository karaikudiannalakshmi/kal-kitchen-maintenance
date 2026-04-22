import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  getDocs,
} from 'firebase/firestore'

// All values come from Vercel environment variables (VITE_ prefix exposes them to browser)
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// ── Collection names ──────────────────────────────────────────────────────
// Prefix isolates this app from other apps sharing the same Firestore project
export const COLS = {
  equipment: 'km_equipment',
  schedule:  'km_schedule',
  repairs:   'km_repairs',
}

// ── Helpers ───────────────────────────────────────────────────────────────

/** Write a single document (creates or overwrites) */
export function fsSet(colName, id, data) {
  return setDoc(doc(db, colName, id), data)
}

/** Merge-update a single document (only changed fields) */
export function fsUpdate(colName, id, data) {
  return updateDoc(doc(db, colName, id), data)
}

/** Delete a single document */
export function fsDel(colName, id) {
  return deleteDoc(doc(db, colName, id))
}

/** Write many documents in one atomic batch (max 500) */
export async function fsBatchSet(colName, items) {
  const batch = writeBatch(db)
  items.forEach(item => {
    batch.set(doc(db, colName, item.id), item)
  })
  return batch.commit()
}

/** Delete many documents in one atomic batch */
export async function fsBatchDel(colName, ids) {
  const batch = writeBatch(db)
  ids.forEach(id => {
    batch.delete(doc(db, colName, id))
  })
  return batch.commit()
}

/** Read all documents once, returns array */
export async function fsGetAll(colName) {
  const snap = await getDocs(collection(db, colName))
  return snap.docs.map(d => d.data())
}

/** Real-time subscription to a collection; returns unsubscribe fn */
export function fsSubscribe(colName, callback) {
  return onSnapshot(collection(db, colName), snap => {
    callback(snap.docs.map(d => d.data()))
  })
}
