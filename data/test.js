import MsgPackEditor from "../dist/index.js";
import { readFileSync } from "fs";

const editor = MsgPackEditor.deserialize(readFileSync("data/test.msgpack"));

console.log(editor.serialize().length);