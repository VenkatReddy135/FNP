# ExportDropdown

ExportDropdown is a component for displaying Dropdown field.

## Props

ExportDropdown needs the following props -

1. data :

- It holds the data required for the Dropdown values.
- Its a object type field for e.g.,
  data: {}

2. record :

- You need to pass the record object of a particular category.
- Its a object type field for e.g.,
  record: {}

3. label :

- It is used to for Dropdown heading.

4. onChange :

- This is used to get the changed value.

5. disable :

- This is the boolean value to be passed to enable or disable DropDown.

6. compareKey:

- This is optional, if you want to compare particular object key value with true value then this will be used. e.g. compareKey: 'status'.

7. compareValue:

- This is optional property and can be boolean or string. You can use this value to compare as true value.
  e.g. compareValue: 'ACTIVE'
