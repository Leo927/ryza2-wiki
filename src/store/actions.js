import { db } from "@/main";



export default {
    setEditMode({ commit }, newMode) {
        commit('setState', newMode);
    },

    updateSetting({state}) {
        db.collection('misc').doc('settings').get().then((response) => {
            state.admins = response.data().admins;
            state.itemTypes = response.data().itemTypes;
            state.toolTypes = response.data().toolTypes;
            state.elements = response.data().elements;
            state.locations = response.data().locations;
        })
    },


    async search(_, { keyword, collections }) {
        var queries = [];
        collections.forEach(col => {
            queries.push(db.collection(col).where('name', '==', keyword).limit(3).get())
        });
        const data = await Promise.all(queries);
        return data.map(x => x.docs).flat(2).map((x) => { return { ...x.data(), id: x.id } })
    },


}