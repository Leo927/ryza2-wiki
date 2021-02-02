const baseEmptyItem = {
    toolTypeIndex:0,
    resources:[]
}

export function emptyPickable() {
    return JSON.parse(JSON.stringify(baseEmptyItem));
}