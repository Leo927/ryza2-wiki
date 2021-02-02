const baseEmptyItem = {
    name: "",
    id : null,
    map: "",
    resourcePoints:[],
    type : 'map',
    photoUrl: 'https://via.placeholder.com/150'
}

export function emptyMap() {
    return JSON.parse(JSON.stringify(baseEmptyItem));
}