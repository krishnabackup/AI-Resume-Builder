import { openDB } from "idb";

const DB_NAME = "ATSResumeDB";
const STORE_NAME = "files";

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveFile(key, file) {
  const db = await getDB();
  await db.put(STORE_NAME, file, key);
}

export async function getFile(key) {
  const db = await getDB();
  return db.get(STORE_NAME, key);
}

export async function deleteFile(key) {
  const db = await getDB();
  return db.delete(STORE_NAME, key);
}