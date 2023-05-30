import BufferReader from "./buffer-reader.js";
import deserialize from "./deserialize.js";
import serialize from "./serialize.js";
import type { MsgPackSchema } from "./type.js";

export default class MsgPackEditor<T = any>{
  public static deserialize<T = any>(chunk:Buffer):MsgPackEditor<T>{
    const { data, schema } = deserialize(new BufferReader(chunk));

    return new MsgPackEditor(data, schema);
  }
  public static serialize(data:any, schema:MsgPackSchema):Buffer{
    return serialize(data, schema);
  }

  public readonly data:T;
  public readonly schema:MsgPackSchema;

  private constructor(data:T, schema:MsgPackSchema){
    this.data = data;
    this.schema = schema;
  }
  public serialize():Buffer{
    return MsgPackEditor.serialize(this.data, this.schema);
  }
}