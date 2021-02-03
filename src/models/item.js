const baseEmptyItem = {
    name: "",
    id : null,
    sources : [],
    develops : [],
    itemTypeIndex : 0,
    type : 'item',
    elementIndexes: [],
    photoUrl: "",
    attributes:[]
}

export function emptyItem() {
    return JSON.parse(JSON.stringify(baseEmptyItem));
}



