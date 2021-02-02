export function getAllResourcesFromMap(item) {
    return item.resourcePoints
        .flat(3)
        .map((x) => x.pickables)
        .flat(3)
        .map((x) => x.resources)
        .flat(3);
}