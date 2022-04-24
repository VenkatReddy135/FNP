# CustomSourceData

CustomSourceData renders list of strings. It has capability to render list of string wrapped in span tag from Array of objects and Array of strings.

## Rendering List of Strings from Array

CustomSourceData can render the list of Strings in the following scenarios -

1. Rendering List of Strings from Array of String :

- If the response have the Array of String as Source endpoint then the Array can be rendered with the list of strings in the same cell of Grid. For e.g.,
  {
  source: "name of Array of String",
  type: "CustomSourceData",
  label: "Name of Column"
  }

2. Rendering List of String from Array of Objects

- If the response have the Array of Objects then another props is passed as "field" which holds the name of Array and source will be the name of field label item present in array.

- If the response have the Array of Objects as Source endpoint then the Array can be rendered with the list of strings of respective Array field label in the same cell of Grid. For e.g.,
  {
  source: "name of field label present in Array",
  type: "CustomSourceData",
  field: "name of Array"
  label: "Name of Column"
  }

- All the properties should be available in Array of Objects else it will show a empty space at the place of absent property.

### About field prop

- "field" prop is optional. It is required only for Array of Objects.
- "field" prop can be ignored for the Array of Strings.
