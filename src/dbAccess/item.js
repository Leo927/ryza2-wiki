import firebase from 'firebase/app'
import 'firebase/firestore'
import { addEntry, getEntry, deleteEntry } from './firestore';
import { uploadImage, deleteImage } from '@/storageAccess/firebaseStorage';
import { db } from '@/main';
import { updateLink } from '@/dbAccess/referenceManagement';
import {emptyItem} from '@/models/item';



const TYPE = "item"

export async function setItem(item, photoFile, ref=null) {
    if (!item) {
        throw "item undefined in createItem"
    }
    if (!item.id) {
        ref = db.collection(item.type).doc();
        item.id = ref.id;
    }
    if (photoFile) {
        uploadImage(item.type, ref.id, photoFile).then( async function(response){
            item.photoUrl = await response.ref.getDownloadURL()  
            return addEntry(item, ref);
        })
    }else{
        return addEntry(item, ref);
    }
    
}

export async function createItem(item, photoFile, ref=null){
    var task = await setItem(item, photoFile, ref);
    updateItemLinks(item, emptyItem())
    addItemIndex(item)
    return task
}


export async function deleteItem(item) {
    if (!item) {
        throw "item undefined in deleteItem"
    }
    if(!item.id){
        throw "item.id is undefined in delteItem"
    }
    if(item.photoUrl){
        await deleteImage(item)
    }
    updateItemLinks(emptyItem(), item)
    removeItemIndex(item)
    return deleteEntry(item)    
}

export function getItem(id) {
    if (!id) {
        throw "id is undefined when getting item"
    }

    return getEntry({ type: TYPE, id })
}

export function updateItem(item, original, photoFile){
    if(!item){
        throw 'item is empty in updateItem'
    }
    if(!item.id){
        throw 'item.id is null in updateItem'
    }
    if(!original){
        throw 'original is null in updateItem'
    }
    var ref = db.collection(TYPE).doc(item.id)
    updateItemLinks(item, original)
    return setItem(item, photoFile, ref)
}

export function updateItemLinks( current, original) {
    if(!current || !original){
        throw `Argument error in updateItemLinks. current:${current}, original:${original}`
    }
    updateLink(current['develops'], original['develops'], current, 'sources')
    updateLink(current['sources'], original['sources'], current, 'develops')
}

export async function addItemIndex(item){
    await db.collection(TYPE).doc('index').update({
        itemArray: firebase.firestore.FieldValue.arrayUnion({name:item.name, id:item.id, type:item.type})
    });
}

export async function removeItemIndex(item){    
    await db.collection(TYPE).doc('index').update({
        itemArray: firebase.firestore.FieldValue.arrayRemove({name:item.name, id:item.id, type:item.type})
    });
}
