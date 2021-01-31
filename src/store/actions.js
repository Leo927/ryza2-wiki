import { db, storageRef } from "@/main";

function getDeviation(current, original) {
    let pos = current.filter((x) => !original.includes(x));
    let neg = original.filter((x) => !current.includes(x));
    return { pos, neg };
}


export default {
    setEditMode({ commit }, newMode) {
        commit('setState', newMode);
    },
    addItem(_, payload) {
        return db.collection(payload.type)
            .add({ ...payload });
    },
    getItem(_, payload) {
        return db.collection(payload.type)
            .doc(payload.id)
            .get()
    },
    updateItem(_, payload) {
        return db.collection(payload.type)
            .doc(payload.id)
            .update(payload);
    },
    deleteItem(_, id) {
        return db.collection("item")
            .doc(id)
            .delete();
    },
    async search(_, { keyword, collections }) {
        var queries = [];
        collections.forEach(col => {
            queries.push(db.collection(col).where('name', '==', keyword).limit(3).get())
        });
        const data = await Promise.all(queries);
        return data.map(x => x.docs).flat(2).map(x => x.data())
    },
    async updateReference({ dispatch }, { current, original, from, to }) {
        const deviation = getDeviation(current[from], original[from]);
        var e;
        for (let index = 0; index < deviation.pos.length; index++) {
            e = deviation.pos[index];
            e = (await dispatch('getItem', e)).data()
            if (e == null) {
                throw "Error: cannot find element";
            }
            e[to].push(current)
            e = {
                id: e.id,
                [to]: e[to],
                type: e.type
            }
            dispatch('updateItem', e)
        }

        for (let index = 0; index < deviation.neg.length; index++) {
            e = deviation.neg[index];
            e = (await dispatch('getItem', e)).data()
            if (e == null) {
                throw "Error: cannot find element";
            }
            const i = e[to].findIndex(x => x.id == current.id);
            if (i == null) {
                return;
            }
            e[to].splice(i, 1)
            e = {
                id: e.id,
                [to]: e[to],
                type: e.type
            }
            dispatch('updateItem', e)
        }
    },
    
    updateDifferences({ dispatch }, { current, original }) {
        dispatch('updateReference', { current, original, from: 'sources', to: 'develops' })
        dispatch('updateReference', { current, original, from: 'develops', to: 'sources' })
    },

    uploadImage(_,{type,id, file, callback}){
        const ref = storageRef.child(`/$images/${type}/${id}`)
        ref.put(file).then(callback)
    }
}