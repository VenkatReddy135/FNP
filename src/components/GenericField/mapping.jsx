import { BooleanInput, DateInput, maxLength, maxValue, minLength, minValue, NumberInput, TextInput } from "react-admin";
import DateTimeInput from "../CustomDateTime";
import JsonEditorField from "../jsonEditorField";

export default {
  mysql_database: {
    CHAR: {
      type: TextInput,
      validate: [minLength(0), maxLength(255)],
    },
    VARCHAR: {
      type: TextInput,
      validate: [minLength(0), maxLength(65535)],
      options: { multiLine: true },
    },
    TINYTEXT: {
      type: TextInput,
      validate: [minLength(0), maxLength(255)],
    },
    TEXT: {
      type: TextInput,
      validate: [minLength(0), maxLength(65535)],
    },
    BLOB: {
      type: TextInput,
      validate: [minLength(0), maxLength(65535)],
    },
    MEDIUMTEXT: {
      type: TextInput,
      validate: [minLength(0), maxLength(16777215)],
    },
    MEDIUMBLOB: {
      type: TextInput,
      validate: [minLength(0), maxLength(16777215)],
    },
    LONGTEXT: {
      type: TextInput,
      validate: [minLength(0), maxLength(4294967295)],
    },
    LONGBLOB: {
      type: TextInput,
      validate: [minLength(0), maxLength(4294967295)],
    },
    TINYINT: {
      type: NumberInput,
      validate: [minValue(-128), maxValue(127)],
    },
    SMALLINT: {
      type: NumberInput,
      validate: [minValue(-32768), maxValue(32767)],
    },
    MEDIUMINT: {
      type: NumberInput,
      validate: [minValue(-8388608), maxValue(8388607)],
    },
    INT: {
      type: NumberInput,
      validate: [minValue(-2147483648), maxValue(2147483647)],
    },
    BIGINT: {
      type: NumberInput,
      validate: [minValue(0), maxValue(9223372036854775807)],
      min: 0,
    },
    FLOAT: {
      type: NumberInput,
    },
    DOUBLE: {
      type: NumberInput,
    },
    DECIMAL: {
      type: NumberInput,
    },
    BIT: {
      type: NumberInput,
    },
    DATE: {
      type: DateInput,
      options: {
        format: "YYYY-MM-DD",
      },
    },
    DATETIME: {
      type: DateTimeInput,
    },
    BOOLEAN: {
      type: BooleanInput,
    },
  },
  mongo_database: {
    VARCHAR: {
      type: JsonEditorField,
    },
  },
  arango_database: {
    VARCHAR: {
      type: JsonEditorField,
    },
  },
};
