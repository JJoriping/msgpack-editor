export function getMSB(byte) {
    return Boolean(byte & 128);
}
export function getComplement2(bytes) {
    const R = bytes.map(v => v ^ 255);
    R[R.length - 1]++;
    return R;
}
export function constructNumber(bytes) {
    let R = 0;
    for (let i = 0; i < bytes.length; i++) {
        R |= bytes[i] << (8 * (bytes.length - i - 1));
    }
    return R;
}
export function constructBigInt(bytes) {
    let R = 0n;
    for (let i = 0; i < bytes.length; i++) {
        R |= BigInt(bytes[i]) << BigInt(8 * (bytes.length - i - 1));
    }
    return R;
}
//# sourceMappingURL=utility.js.map