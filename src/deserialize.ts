import BufferReader from "./buffer-reader.js";
import { MsgPackSchema } from "./type.js";
import { getMSB, getComplement2, constructNumber, constructBigInt } from "./utility.js";

export default function deserialize(reader:BufferReader):{ data: any, schema: MsgPackSchema }{
  const offset = reader.offset;
  const c = reader.readByte();

  if(c === 0xC0){
    return { data: null, schema: { type: "null" } };
  }
  if(c === 0xC2){
    return { data: false, schema: { type: "boolean" } };
  }
  if(c === 0xC3){
    return { data: true, schema: { type: "boolean" } };
  }
  if(!getMSB(c)){
    return { data: c, schema: { type: "uint8", short: true } };
  }
  if((c & 0b1110_0000) === 0b1110_0000){
    return { data: -getComplement2([ c ])[0], schema: { type: "int8", short: true } };
  }
  if(c === 0xCC){
    return { data: reader.readByte(), schema: { type: "uint8" } };
  }
  if(c === 0xCD){
    const b = reader.readBytes(2);

    return { data: constructNumber(b), schema: { type: "uint16" } };
  }
  if(c === 0xCE){
    const b = reader.readBytes(4);

    return { data: constructNumber(b), schema: { type: "uint32" } };
  }
  if(c === 0xCF){
    const b = reader.readBytes(8);

    return { data: constructBigInt(b), schema: { type: "uint64" } };
  }
  if(c === 0xD0){
    const b = reader.readByte();
    
    if(getMSB(b)){
      return { data: -getComplement2([ b ])[0], schema: { type: "int8" } };
    }
    return { data: b, schema: { type: "int8" } };
  }
  if(c === 0xD1){
    const b = reader.readBytes(2);

    if(getMSB(b[0])){
      return { data: -constructNumber(getComplement2(b)), schema: { type: "int16" } };
    }
    return { data: constructNumber(b), schema: { type: "int16" } };
  }
  if(c === 0xD2){
    const b = reader.readBytes(4);

    if(getMSB(b[0])){
      return { data: -constructNumber(getComplement2(b)), schema: { type: "int32" } };
    }
    return { data: constructNumber(b), schema: { type: "int32" } };
  }
  if(c === 0xD3){
    const b = reader.readBytes(8);

    if(getMSB(b[0])){
      return { data: -constructBigInt(getComplement2(b)), schema: { type: "int64" } };
    }
    return { data: constructBigInt(b), schema: { type: "int64" } };
  }
  if(c === 0xCA){
    const b = reader.readBytes(4);

    return { data: Buffer.from(b).readFloatBE(), schema: { type: "float32" } };
  }
  if(c === 0xCB){
    const b = reader.readBytes(8);

    return { data: Buffer.from(b).readDoubleBE(), schema: { type: "float64" } };
  }
  if((c & 0b1110_0000) === 0b1010_0000){
    const l = c & 0b1_1111;
    const b = reader.readBytes(l);
    
    return { data: Buffer.from(b).toString(), schema: { type: "string8", short: true } };
  }
  if(c === 0xD9){
    const l = reader.readByte();
    const b = reader.readBytes(l);

    return { data: Buffer.from(b).toString(), schema: { type: "string8" } };
  }
  if(c === 0xDA){
    const l = reader.readBytes(2);
    const b = reader.readBytes(constructNumber(l));

    return { data: Buffer.from(b).toString(), schema: { type: "string16" } };
  }
  if(c === 0xDB){
    const l = reader.readBytes(4);
    const b = reader.readBytes(constructNumber(l));

    return { data: Buffer.from(b).toString(), schema: { type: "string32" } };
  }
  if(c === 0xC4){
    const l = reader.readByte();
    const b = reader.readBytes(l);

    return { data: Buffer.from(b), schema: { type: "binary8" } };
  }
  if(c === 0xC5){
    const l = reader.readBytes(2);
    const b = reader.readBytes(constructNumber(l));

    return { data: Buffer.from(b), schema: { type: "binary16" } };
  }
  if(c === 0xC6){
    const l = reader.readBytes(4);
    const b = reader.readBytes(constructNumber(l));

    return { data: Buffer.from(b), schema: { type: "binary32" } };
  }
  if((c & 0b1111_0000) === 0b1001_0000){
    const l = c & 0b1111;
    const dataList:any[] = [];
    const schemaList:MsgPackSchema[] = [];
    
    for(let i = 0; i < l; i++){
      const { data, schema } = deserialize(reader);

      dataList.push(data);
      schemaList.push(schema);
    }
    return { data: dataList, schema: { type: "array8", items: schemaList } };
  }
  if(c === 0xDC){
    const l = constructNumber(reader.readBytes(2));
    const dataList:any[] = [];
    const schemaList:MsgPackSchema[] = [];
    
    for(let i = 0; i < l; i++){
      const { data, schema } = deserialize(reader);

      dataList.push(data);
      schemaList.push(schema);
    }
    return { data: dataList, schema: { type: "array16", items: schemaList } };
  }
  if(c === 0xDD){
    const l = constructNumber(reader.readBytes(4));
    const dataList:any[] = [];
    const schemaList:MsgPackSchema[] = [];
    
    for(let i = 0; i < l; i++){
      const { data, schema } = deserialize(reader);

      dataList.push(data);
      schemaList.push(schema);
    }
    return { data: dataList, schema: { type: "array32", items: schemaList } };
  }
  if((c & 0b1111_0000) === 0b1000_0000){
    const l = c & 0b1111;
    const data:Record<string, any> = {};
    const entries:[MsgPackSchema, MsgPackSchema][] = [];

    for(let i = 0; i < l; i++){
      const { data: keyData, schema: keySchema } = deserialize(reader);
      const { data: valueData, schema: valueSchema } = deserialize(reader);

      data[keyData] = valueData;
      entries.push([ keySchema, valueSchema ]);
    }
    return { data, schema: { type: "map8", entries } };
  }
  if(c === 0xDE){
    const l = constructNumber(reader.readBytes(2));
    const data:Record<string, any> = {};
    const entries:[MsgPackSchema, MsgPackSchema][] = [];

    for(let i = 0; i < l; i++){
      const { data: keyData, schema: keySchema } = deserialize(reader);
      const { data: valueData, schema: valueSchema } = deserialize(reader);

      data[keyData] = valueData;
      entries.push([ keySchema, valueSchema ]);
    }
    return { data, schema: { type: "map16", entries } };
  }
  if(c === 0xDF){
    const l = constructNumber(reader.readBytes(4));
    const data:Record<string, any> = {};
    const entries:[MsgPackSchema, MsgPackSchema][] = [];

    for(let i = 0; i < l; i++){
      const { data: keyData, schema: keySchema } = deserialize(reader);
      const { data: valueData, schema: valueSchema } = deserialize(reader);

      data[keyData] = valueData;
      entries.push([ keySchema, valueSchema ]);
    }
    return { data, schema: { type: "map32", entries } };
  }
  throw Error(`Unhandled byte '${c}' at position ${offset}`);
}