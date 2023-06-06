import Dexie from "dexie";

const db = new Dexie('knowd');
db.version(1).stores({
    embeddings: "++id,text"
});
db.open().catch(e => console.error('could not open db'));

export { db };
