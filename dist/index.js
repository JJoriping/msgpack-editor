import BufferReader from "./buffer-reader.js";
import deserialize from "./deserialize.js";
export default class MsgPackEditor {
    static deserialize(chunk) {
        const { data, schema } = deserialize(new BufferReader(chunk));
        return new MsgPackEditor(data, schema);
    }
    constructor(data, schema) {
        this.data = data;
        this.schema = schema;
    }
}
//# sourceMappingURL=index.js.map