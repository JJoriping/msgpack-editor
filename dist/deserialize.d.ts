import BufferReader from "./buffer-reader.js";
import { MsgPackSchema } from "./type.js";
export default function deserialize(reader: BufferReader): {
    data: any;
    schema: MsgPackSchema;
};
