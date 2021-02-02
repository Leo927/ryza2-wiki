import {storageRef} from '@/main';

export function uploadImage(type, id, file) {
    const ref = storageRef.child(`/$images/${type}/${id}`)
    return ref.put(file)
}

export function deleteImage({type, id}){
    if(!type || !id){
        throw `Argument error. type: ${type}, id:${id}`
    }
    const ref = storageRef.child(`/$images/${type}/${id}`)
    return ref.delete()
}

export async function getImageURL(type, id){
    if(!type || !id){
        throw `argument error, type:${type}, id:${id}`
    }
    const ref = storageRef.child(`/$images/${type}/${id}`)
    return await ref.getDownloadURL()
}