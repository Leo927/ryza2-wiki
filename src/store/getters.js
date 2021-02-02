export default{
    isAdmin: (state)=>{
        return state.admins.includes(state.uid) 
    }
}