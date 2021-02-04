export default{
    isAdmin: ()=>{
        return true
    },

    // use the following for access control
    // isAdmin: (state)=>{
    //     return state.admins.includes(state.uid)
    // },

    itemArray: (state)=>{
        return state.items
    }
}