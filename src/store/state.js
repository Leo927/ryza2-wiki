import items from '@/mockdata/item.js'
import { db } from "@/main";
export default{
    items,
    editMode:false ,
    firestore: function () {
        return {
          items: db.collection("items"),
        };
    }
}