const baseEmptyItem = {
    pos: [],
    pickables:[],
    color:"black",
    photoUrl:""
}

export function emptyResoucePoint() {
    return JSON.parse(JSON.stringify(baseEmptyItem));
}

