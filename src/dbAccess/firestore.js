import { db } from '@/main';

export function addEntry(payload, ref=null) {
    if(!payload){
        throw 'payload undefined'
    }
    if(!payload.id){
        if(!ref){
            ref = db.collection(payload.type).doc();
        }        
        payload.id = ref.id;
    }else if(!ref){
        ref = db.collection(payload.type).doc(payload.id);
    }
    return ref
        .set(payload);
}

export function getEntry(payload) {
    return db.collection(payload.type)
        .doc(payload.id)
        .get()
}

export function updateEntry(payload) {
    return db.collection(payload.type)
        .doc(payload.id)
        .update(payload);
}

export function deleteEntry(payload) {
    return db.collection(payload.type)
        .doc(payload.id)
        .delete();
}
