import type { MsgPackSchema } from "./type.js";
import { destructBigInt, destructNumber, getComplement2 } from "./utility.js";

export default function serialize(data:any, schema:MsgPackSchema):Buffer{
  const R:number[] = [];

  switch(schema.type){
    case "null": R.push(0xC0); break;
    case "boolean": assertBoolean(data) && R.push(data ? 0xC3 : 0xC2); break;
    case "uint8":
      if(!assertNumber(data)) break;
      if(schema.short) R.push(data);
      else R.push(0xCC, data);
      break;
    case "uint16":
      if(!assertNumber(data)) break;
      R.push(0xCD, ...destructNumber(data, 2));
      break;
    case "uint32":
      if(!assertNumber(data)) break;
      R.push(0xCE, ...destructNumber(data, 4));
      break;
    case "uint64":
      if(!assertBigInt(data)) break;
      R.push(0xCF, ...destructBigInt(BigInt(data), 8));
      break;
    case "int8":
      if(!assertNumber(data)) break;
      if(schema.short) R.push(...getComplement2([ -data ]));
      else R.push(0xD0, data);
      break;
    case "int16":
      if(!assertNumber(data)) break;
      if(data < 0) R.push(0xD1, ...getComplement2(destructNumber(-data, 2)));
      else R.push(0xD1, ...destructNumber(data, 2));
      break;
    case "int32":
      if(!assertNumber(data)) break;
      if(data < 0) R.push(0xD2, ...getComplement2(destructNumber(-data, 4)));
      else R.push(0xD2, ...destructNumber(data, 4));
      break;
    case "int64":
      if(!assertBigInt(data)) break;
      if(data[0] === "-") R.push(0xD3, ...getComplement2(destructBigInt(-BigInt(data), 8)));
      else R.push(0xD3, ...destructBigInt(BigInt(data), 8));
      break;
    case "float32":{
      if(!assertNumber(data)) break;
      const buffer = Buffer.alloc(4);
      buffer.writeFloatBE(data);
      R.push(0xCA, ...buffer);
    } break;
    case "float64":{
      if(!assertNumber(data)) break;
      const buffer = Buffer.alloc(8);
      buffer.writeDoubleBE(data);
      R.push(0xCB, ...buffer);
    } break;
    case "string8":
      if(!assertString(data)) break;
      if(schema.short) R.push(0b1010_0000 | data.length, ...Buffer.from(data));
      else R.push(0xD9, data.length, ...Buffer.from(data));
      break;
    case "string16":
      if(!assertString(data)) break;
      R.push(0xDA, ...destructNumber(data.length, 2), ...Buffer.from(data));
      break;
    case "string32":
      if(!assertString(data)) break;
      R.push(0xDB, ...destructNumber(data.length, 4), ...Buffer.from(data));
      break;
    case "binary8":
      if(!assertBuffer(data)) break;
      R.push(0xC4, data.length, ...data);
      break;
    case "binary16":
      if(!assertBuffer(data)) break;
      R.push(0xC5, ...destructNumber(data.length, 2), ...data);
      break;
    case "binary32":
      if(!assertBuffer(data)) break;
      R.push(0xC6, ...destructNumber(data.length, 4), ...data);
      break;
    case "array8":
      if(!assertArray(data)) break;
      R.push(0b1001_0000 | data.length);
      for(const v of data.map((v, i) => serialize(v, schema.items[i]))){
        R.push(...v);
      }
      break;
    case "array16":
      if(!assertArray(data)) break;
      R.push(0xDC, ...destructNumber(data.length, 2));
      for(const v of data.map((v, i) => serialize(v, schema.items[i]))){
        R.push(...v);
      }
      break;
    case "array32":
      if(!assertArray(data)) break;
      R.push(0xDD, ...destructNumber(data.length, 4));
      for(const v of data.map((v, i) => serialize(v, schema.items[i]))){
        R.push(...v);
      }
      break;
    case "map8":{
      const entries = Object.entries(data);

      R.push(0b1000_0000 | entries.length);
      for(let i = 0; i < entries.length; i++){
        const [ key, value ] = entries[i];
        
        for(const v of serialize(key, schema.entries[i][0])) R.push(v);
        for(const v of serialize(value, schema.entries[i][1])) R.push(v);
      }
    } break;
    case "map16":{
      const entries = Object.entries(data);

      R.push(0xDE, ...destructNumber(entries.length, 2));
      for(let i = 0; i < entries.length; i++){
        const [ key, value ] = entries[i];
        
        for(const v of serialize(key, schema.entries[i][0])) R.push(v);
        for(const v of serialize(value, schema.entries[i][1])) R.push(v);
      }
    } break;
    case "map32":{
      const entries = Object.entries(data);

      R.push(0xDF, ...destructNumber(entries.length, 4));
      for(let i = 0; i < entries.length; i++){
        const [ key, value ] = entries[i];
        
        for(const v of serialize(key, schema.entries[i][0])) R.push(v);
        for(const v of serialize(value, schema.entries[i][1])) R.push(v);
      }
    } break;
  }
  return Buffer.from(R);
}

function assertBoolean(data:any):data is boolean{
  if(typeof data !== "boolean"){
    throw Error(`Boolean assertion failed: ${data}`);
  }
  return true;
}
function assertNumber(data:any):data is number{
  if(typeof data !== "number"){
    throw Error(`Number assertion failed: ${data}`);
  }
  return true;
}
function assertBigInt(data:any):data is `${bigint}`{
  try{
    BigInt(data);
  }catch(err){
    throw Error(`BigInt assertion failed: ${data}`);
  }
  return true;
}
function assertString(data:any):data is string{
  if(typeof data !== "string"){
    throw Error(`String assertion failed: ${data}`);
  }
  return true;
}
function assertBuffer(data:any):data is Buffer{
  if(!(data instanceof Buffer)){
    throw Error(`Buffer assertion failed: ${data}`);
  }
  return true;
}
function assertArray(data:any):data is any[]{
  if(!Array.isArray(data)){
    throw Error(`Array assertion failed: ${data}`);
  }
  return true;
}