export default class BufferReader{
  private readonly buffer:Buffer;
  private _offset:number;
  public get offset():number{
    return this._offset;
  }
  
  constructor(buffer:Buffer){
    this.buffer = buffer;
    this._offset = 0;
  }
  public readByte():number{
    const R = this.buffer.at(this._offset);

    if(R === undefined) throw Error(`No more bytes: ${this._offset}`);
    this._offset++;
    return R;
  }
  public readBytes(length:number):number[]{
    const R = this.buffer.subarray(this._offset, this._offset + length);

    if(R.length < length) throw Error(`No more bytes: ${this._offset}, ${length}`);
    this._offset += length;
    return Array.from(R);
  }
}