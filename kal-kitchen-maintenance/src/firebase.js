import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, doc,
  setDoc, updateDoc, deleteDoc,
  onSnapshot, writeBatch,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyBkAo5Hv4w9QxQB9-7UZRom8EC5zH2UCTw",
  authDomain:        "kal-kitchen-maintenance.firebaseapp.com",
  projectId:         "kal-kitchen-maintenance",
  storageBucket:     "kal-kitchen-maintenance.firebasestorage.app",
  messagingSenderId: "767517122091",
  appId:             "1:767517122091:web:a03baae5e28e81d453d46e",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export const COLS = {
  equipment: 'km_equipment',
  schedule:  'km_schedule',
  repairs:   'km_repairs',
}

export const fsSet    = (col, id, data) => setDoc(doc(db, col, id), data)
export const fsUpdate = (col, id, data) => updateDoc(doc(db, col, id), data)
export const fsDel    = (col, id)       => deleteDoc(doc(db, col, id))

export async function fsBatchSet(colName, items) {
  if (!items.length) return
  const batch = writeBatch(db)
  items.forEach(item => batch.set(doc(db, colName, item.id), item))
  return batch.commit()
}

export async function fsBatchDel(colName, ids) {
  if (!ids.length) return
  const batch = writeBatch(db)
  ids.forEach(id => batch.delete(doc(db, colName, id)))
  return batch.commit()
}

export function fsSubscribe(colName, callback) {
  return onSnapshot(collection(db, colName), snap => {
    callback(snap.docs.map(d => d.data()))
  })
}
