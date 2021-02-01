const baseEmptyItem = {
    tool:"",
    resources:[]
}

export function emptyPickable() {
    return JSON.parse(JSON.stringify(baseEmptyItem));
}