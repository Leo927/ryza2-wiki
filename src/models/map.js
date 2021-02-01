const baseEmptyItem = {
    name: "",
    id : null,
    map: "",
    resourcePoints:[],
    type : 'map',
    photoUrl: ""
}

export function emptyMap() {
    return JSON.parse(JSON.stringify(baseEmptyItem));
}