import firebase from 'firebase/app'
import 'firebase/firestore'
import { db } from '@/main';

const settingRef = db.collection('misc').doc('settings');

export async function addAttribute(attr){    
    await settingRef.update({
        attributes: firebase.firestore.FieldValue.arrayUnion(attr)
    });
}

export async function removeAttribute(attr){    
    await settingRef.update({
        attributes: firebase.firestore.FieldValue.arrayRemove(attr)
    });
}

export async function setdefaultItemTypeIndex(value){
    await settingRef.update({
        defaultItemTypeIndex: value
    })
}