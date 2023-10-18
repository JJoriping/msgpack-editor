/// <reference types="node" />
export default class BufferReader {
    private readonly buffer;
    private _offset;
    get offset(): number;
    constructor(buffer: Buffer);
    readByte(): number;
    readBytes(length: number): number[];
}
