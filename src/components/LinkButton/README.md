# LinkButton

LinkButton is a component for displaying enabled/disabled link field.

## Props

LinkButton needs the following props -

1. record :

- You need to pass the record object of a particular category
- Its a object type field for e.g.,
  record: {}

2. source :

- This works as an key of index of an array name record.

3. onClick :

- This is used to Text value to Clipboard.

4. link :

- This is the string value to be passed to display link for the Text field.

5. disable :

- This is the boolean value to be passed to enable or disable Text field.

6. compareKey:

- This is optional, if you want to compare particular object key value with true value then this will be used. e.g. compareKey: 'status'.

7. compareValue:

- This is optional property and can be boolean or string. You can use this value to compare as true value.
  e.g. compareValue: 'ACTIVE'
