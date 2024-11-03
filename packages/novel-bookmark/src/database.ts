const DB_NAME = "novel-bookmarks";
const DB_VERSION = 1;
const DB_STORE_NAME = "novel-bookmarks-store";

let _db: IDBDatabase;

async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function () {
      _db = this.result;
      resolve(_db);
    };
    req.onerror = (event) => {
      reject(event);
    };
    req.onupgradeneeded = (event) => {
      const eventTarget = event.target;
      if (!eventTarget || !("result" in eventTarget)) {
        console.error("openDatabase: event.target is invalid", eventTarget);
        reject(event);
        return;
      }
      const db = eventTarget.result;
      if (!(db instanceof IDBDatabase)) {
        console.error("openDatabase: event.target.result is invalid", db);
        reject(event);
        return;
      }

      db.createObjectStore(DB_STORE_NAME, {
        keyPath: "url",
      });
    };
  });
}

async function getDatabase(): Promise<IDBDatabase> {
  if (_db) return _db;
  return openDatabase();
}

async function getTransaction(
  mode: "readonly" | "readwrite",
): Promise<IDBTransaction> {
  const db = await getDatabase();
  return db.transaction([DB_STORE_NAME], mode);
}

export async function addToDatabase<T>(item: T): Promise<void> {
  const tx = await getTransaction("readwrite");
  return new Promise((resolve, reject) => {
    const request = tx.objectStore(DB_STORE_NAME).add(item);
    tx.oncomplete = () => {
      resolve();
    };
    request.onerror = (event) => {
      reject(event);
    };
  });
}

export async function deleteFromDatabase(key: string): Promise<void> {
  const tx = await getTransaction("readwrite");
  return new Promise((resolve, reject) => {
    const request = tx.objectStore(DB_STORE_NAME).delete(key);
    tx.oncomplete = () => {
      resolve();
    };
    request.onerror = (event) => {
      reject(event);
    };
  });
}

export async function getAllFromDatabase<T>(
  typeGuard: (data: unknown) => data is T,
): Promise<T[]> {
  const tx = await getTransaction("readonly");
  return new Promise((resolve, reject) => {
    const request = tx.objectStore(DB_STORE_NAME).openCursor();
    const items: T[] = [];
    request.onsuccess = (event) => {
      const eventTarget = event.target;
      if (!eventTarget || !("result" in eventTarget)) {
        console.error(
          "getAllFromDatabase: event.target is invalid",
          eventTarget,
        );
        reject(event);
        return;
      }
      const cursor = eventTarget.result;
      if (cursor instanceof IDBCursorWithValue) {
        if (typeGuard(cursor.value)) {
          items.push(cursor.value);
          cursor.continue();
        } else {
          console.error(
            "getAllFromDatabase: event.target.result.value is invalid",
            cursor.value,
          );
          reject(event);
        }
      } else if (cursor === null) {
        resolve(items);
      } else {
        console.error(
          "getAllFromDatabase: event.target.result is invalid",
          cursor,
        );
        reject(event);
      }
    };
    request.onerror = (event) => {
      reject(event);
    };
  });
}

export async function getFromDatabase<T>(
  key: string,
  typeGuard: (data: unknown) => data is T,
): Promise<T | null | undefined> {
  const tx = await getTransaction("readonly");
  return new Promise((resolve, reject) => {
    const request = tx.objectStore(DB_STORE_NAME).get(key);
    request.onsuccess = (event) => {
      const eventTarget = event.target;
      if (!eventTarget || !("result" in eventTarget)) {
        console.error("getFromDatabase: event.target is invalid", eventTarget);
        reject(event);
        return;
      }
      const item = eventTarget.result;
      if (typeGuard(item)) {
        resolve(item);
      } else if (item === null || item === undefined) {
        resolve(item);
      } else {
        console.error("getFromDatabase: event.target.result is invalid", item);
        reject(event);
      }
    };
    request.onerror = (event) => {
      reject(event);
    };
  });
}
