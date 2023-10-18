/// <reference types="node" />
import type { MsgPackSchema } from "./type.js";
export default class MsgPackEditor<T = any> {
    static deserialize<T = any>(chunk: Buffer): MsgPackEditor<T>;
    static serialize(data: any, schema: MsgPackSchema): Buffer;
    readonly data: T;
    readonly schema: MsgPackSchema;
    private constructor();
    serialize(): Buffer;
}
