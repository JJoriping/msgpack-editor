export default class BufferReader {
    get offset() {
        return this._offset;
    }
    constructor(buffer) {
        this.buffer = buffer;
        this._offset = 0;
    }
    readByte() {
        const R = this.buffer.at(this._offset);
        if (R === undefined)
            throw Error(`No more bytes: ${this._offset}`);
        this._offset++;
        return R;
    }
    readBytes(length) {
        const R = this.buffer.subarray(this._offset, this._offset + length);
        if (R.length < length)
            throw Error(`No more bytes: ${this._offset}, ${length}`);
        this._offset += length;
        return Array.from(R);
    }
}
//# sourceMappingURL=buffer-reader.js.map