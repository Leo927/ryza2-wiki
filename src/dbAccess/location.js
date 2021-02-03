import { db } from '@/main';

const settingsDoc = db.collection('misc').doc('settings');

export function updateLocations(locations) {
    return settingsDoc.update({ locations });
}