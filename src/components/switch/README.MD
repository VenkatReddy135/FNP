# SwitchComp

SwitchComp is a component having boolean switch for displaying enabled/disabled field. Material UI Switch is used.

## Props

SwitchComp needs the following props -

1. disable :

- This is used to enable or disable the switch component
- It is a boolean type field e.g., true or false

2. record :

- You need to pass the record object of a category which contains the isEnabled field.
- Its a object type field for e.g.,
  record: {}

3. trueValue :

- This is optional property and can be boolean or string. You can use this value to set value to compare as true value.
  e.g. trueValue: 'ACTIVE'

4. compareKey :

- This is optional, if you want to compare particular object key value with true value then this will be used.
  e.g. compareKey: 'status'
