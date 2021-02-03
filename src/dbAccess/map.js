import firebase from 'firebase/app'
import 'firebase/firestore'
import {getAllResourcesFromMap} from '@/helpers/map';
import {db} from '@/main';
import { addEntry, getEntry, deleteEntry } from './firestore';
import { uploadImage, deleteImage } from '@/storageAccess/firebaseStorage';
import { emptyMap} from '@/models/map';
import { updateLink } from '@/dbAccess/referenceManagement';

const TYPE = 'map';


export async function setMap(map, photoFile, ref=null) {
    if (!map) {
        throw "map undefined in createMap"
    }
    if (!map.id) {
        ref = db.collection(map.type).doc();
        map.id = ref.id;
    }
    if (photoFile) {
        uploadImage(map.type, ref.id, photoFile).then( async function(response){
            map.photoUrl = await response.ref.getDownloadURL()  
            return addEntry(map, ref);          
        })
    }else{
        return addEntry(map, ref);
    }
    
}

export async function createMap(map, photoFile, ref=null){
    var task = await setMap(map, photoFile, ref);
    updateMapLinks(map, emptyMap())
    return task
}


export async function deleteMap(map) {
    if (!map) {
        throw "map undefined in deleteMap"
    }
    if(!map.id){
        throw "map.id is undefined in delteMap"
    }
    if(map.photoUrl){
        await deleteImage(map)
    }
    updateMapLinks(emptyMap(), map)
    return deleteEntry(map)    
}

export function getMap(id) {
    if (!id) {
        throw "id is undefined when getting map"
    }

    return getEntry({ type: TYPE, id })
}

export function updateMap(map, original, photoFile){
    if(!map){
        throw 'map is empty in updateMap'
    }
    if(!map.id){
        throw 'map.id is null in updateMap'
    }
    if(!original){
        throw 'original is null in updateMap'
    }
    var ref = db.collection(TYPE).doc(map.id)
    updateMapLinks(map, original)
    return setMap(map, photoFile, ref)
}

export function updateMapLinks( current, original) {
    if(!current || !original){
        throw `Argument error in updateMapLinks. current:${current}, original:${original}`
    }
    updateLink(getAllResourcesFromMap(current), getAllResourcesFromMap(original), current, 'sources')
}

export async function addMapIndex(map){
    await db.collection(TYPE).doc('index').update({
        mapArray: firebase.firestore.FieldValue.arrayUnion({name:map.name, id:map.id, type:map.type})
    });
}

export async function removeMapIndex(map){    
    await db.collection(TYPE).doc('index').update({
        mapArray: firebase.firestore.FieldValue.arrayRemove({name:map.name, id:map.id, type:map.type})
    });
}



export async function reIndexMaps(){
    const response = await db.collection(TYPE).where('id','!=','null').get();
    const mapArray = response.docs.map(x=>x.data()).map((x=>{
        return {name:x.name, id:x.id, type:x.type}
    }));
    var data = {'mapArray':mapArray}
    await db.collection(TYPE).doc('index').set(data)
}