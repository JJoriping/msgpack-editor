export function getMSB(byte:number):boolean{
  return Boolean(byte & 0b1000_0000);
}
export function getComplement2(bytes:number[]):number[]{
  const R = bytes.map(v => v ^ 0b1111_1111);

  R[R.length - 1]++;
  return R;
}
export function constructNumber(bytes:number[]):number{
  let R = 0;
  
  for(let i = 0; i < bytes.length; i++){
    R |= bytes[i] << (8 * (bytes.length - i - 1));
  }
  return R;
}
export function constructBigInt(bytes:number[]):bigint{
  let R = 0n;
  
  for(let i = 0; i < bytes.length; i++){
    R |= BigInt(bytes[i]) << BigInt(8 * (bytes.length - i - 1));
  }
  return R;
}
export function destructNumber(value:number, length:number):number[]{
  const R:number[] = [];

  for(let i = 0; i < length; i++){
    const distance = 8 * (length - i - 1);
    const mask = 0b1111_1111 << distance;

    R.push((value & mask) >> distance);
  }
  return R;
}
export function destructBigInt(value:bigint, length:number):number[]{
  const R:number[] = [];

  for(let i = 0; i < length; i++){
    const distance = BigInt(8 * (length - i - 1));
    const mask = 0b1111_1111n << distance;

    R.push(Number((value & mask) >> distance));
  }
  return R;
}