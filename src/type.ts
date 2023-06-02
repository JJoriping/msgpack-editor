export type MsgPackSchema = {
  'type': "null"|"boolean"
}|{
  'type': "uint8"|"int8",
  'short'?: boolean
}|{
  'type': "int16"|"int32"|"int64"|"uint16"|"uint32"|"uint64"
}|{
  'type': "float32"|"float64"
}|{
  'type': "string8",
  'short'?: boolean,
  'value'?: string
}|{
  'type': "string16"|"string32",
  'value'?: string
}|{
  'type': "binary8"|"binary16"|"binary32"
}|{
  'type': "array8"|"array16"|"array32",
  'items': MsgPackSchema[]
}|{
  'type': "map8"|"map16"|"map32",
  'entries': [key:MsgPackSchema, value:MsgPackSchema][]
};