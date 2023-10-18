/// <reference types="node" />
import type { MsgPackSchema } from "./type.js";
export default function serialize(data: any, schema: MsgPackSchema): Buffer;
