import BufferReader from "./buffer-reader.js";
import deserialize from "./deserialize.js";
import serialize from "./serialize.js";
export default class MsgPackEditor {
    static deserialize(chunk) {
        const { data, schema } = deserialize(new BufferReader(chunk));
        return new MsgPackEditor(data, schema);
    }
    static serialize(data, schema) {
        return serialize(data, schema);
    }
    constructor(data, schema) {
        this.data = data;
        this.schema = schema;
    }
    serialize() {
        return MsgPackEditor.serialize(this.data, this.schema);
    }
}
//# sourceMappingURL=index.js.map