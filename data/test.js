import MsgPackEditor from "../dist/index.js";
import { readFileSync, writeFileSync } from "fs";

const { data, schema } = MsgPackEditor.deserialize(readFileSync("D:/Dev/JS/unzip/input/header"));

console.log(data);
writeFileSync("output-data.json", JSON.stringify(data, (k, v) => {
  if(typeof v === "bigint") return v.toString();
  return v;
}, 2));
writeFileSync("output-schema.json", JSON.stringify(schema, null, 2));