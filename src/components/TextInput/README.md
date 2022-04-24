# TextInput

TextInput component renders custom react admin text input field.

## Props

TextInput needs the following props -

1. label :

- This contains the label required for the field
- It is a string type field
  e.g., label="senderEmail"

2. edit :

- This prop enables whether field is editable
- It is a boolean field

3. value :

- This prop contains string value of the input field.
  e.g., value: null,

4. validate :

- This contains field validation handler
- It is function type field
  e.g., validate={required()}

5. onChange :

- This contains change event handler function for the input field
  e.g., onChange: null,

6. multiline :

- This is a boolean value which can be passed to allow multi line text input
- e.g., multiline: false,

7. type :

- This prop defines the input field type
- e.g.,  
  type: "text",

8. maxLength:

- Valid when type is text, search, url, tel, email, or password, it defines the maximum number of characters (as UTF-16 code units) the user can enter into the field.

9. min:

- Valid when type is date, month, week, time, datetime-local, number, or range, it defines the most negative value in the range of permitted values.

10. max:

- Valid when type is date, month, week, time, datetime-local, number, or range, it defines the greatest value in the range of permitted values.
