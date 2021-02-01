export function getDeviation (current, original) {
    let pos = current.filter((x) => !original.includes(x));
    let neg = original.filter((x) => !current.includes(x));
    return { pos, neg };
}