import { db } from "@/main";
export default{
    editMode:false ,
    firestore: function () {
        return {
          items: db.collection("items"),
        };
    }
}