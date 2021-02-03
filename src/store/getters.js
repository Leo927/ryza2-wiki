export default{
    isAdmin: (state)=>{
        return state.admins.includes(state.uid) 
    },

    itemArray: (state)=>{
        return state.items
    }
}