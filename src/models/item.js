const baseEmptyItem = {
    name: "",
    id : null,
    sources : [],
    develops : [],
    itemType : "",
    type : 'item',
    elements: []
}

export function emptyItem() {
    return JSON.parse(JSON.stringify(baseEmptyItem));
}



export const ItemType = Object.freeze({ "道具": "道具", "装备": "装备", "炼制素材": "炼制素材", "采集素材": "采集素材" })