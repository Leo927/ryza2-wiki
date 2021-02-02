import { getDeviation } from '@/helpers/findDifference';
import { getEntry, updateEntry } from './firestore';
/**
 * [compare the difference between current and original, put source into pos.targetAttr, remove source from pos.targetAttr]
 * @param {current data} current 
 * @param {previous data} original 
 * @param {entry to be added} source 
 * @param {the attribute that will be updated} targetAttr 
 */
export async function updateLink(current, original, source, targetAttr = "sources") {
    if (!current || !original || !source || !targetAttr) {
        throw `Argument error in updateLink. current:${current}, original:${original}, source:${source}, targetAttr:${targetAttr}`
    }
    var deviation = getDeviation(current, original);
    var e;
    var response;
    for (let index = 0; index < deviation.pos.length; index++) {
        e = deviation.pos[index];


        if (!e[targetAttr]) {
            response = await getEntry(e)
            e = response.data()
        }

        e = response.data()
        if (!e) {
            throw `Error: cannot find element. e=${e}`;
        }
        if (e[targetAttr].find(x => x.id == e.id)) {
            continue
        }
        e[targetAttr].push(source)
        e = {
            id: e.id,
            [targetAttr]: e[targetAttr],
            type: e.type
        }
        updateEntry(e)
    }


    for (let index = 0; index < deviation.neg.length; index++) {
        e = deviation.neg[index];
        if (!e[targetAttr]) {
            response = await getEntry(e)
            e = response.data()
        }
        if (e == null) {
            throw "Error: cannot find element";
        }
        if (e.type == "map") {
            continue
        }
        if (!e[targetAttr]) {
            throw `Error: e.targetAttr undefined ${e}`
        }
        const i = e[targetAttr].findIndex(x => x.id == source.id);
        if (i == null) {
            return;
        }
        e[targetAttr].splice(i, 1)
        e = {
            id: e.id,
            [targetAttr]: e[targetAttr],
            type: e.type
        }
        updateEntry(e)
    }
}
