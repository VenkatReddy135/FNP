# Number Input

Number Input component renders the react-admin number type input value.

## Props

Number Input needs the following props -

1. label :

- This is of string type and takes the label for input.
  For Example:
  label={translate(label)}

2. value :

- This is of number type and takes the value for input.
  The default value is null.
  For Example:
  defaultValue={value}

3. edit :

- This is of boolean type and checks if it is editable or not.
  For Example:
  edit = true;  //editable

4. validate :

- This is an object type which validates the input value.
  The default value is null.
  For Example:
  validate={validate}

5. onChange :

- This is of functionn type and takes the value on input change.
  The default value is null.
  For Example:
  onChange={onChange}

6. typeText :

- This is of string type and take the type text.
  For Example:
  {typeText ? `${value} - ${typeText}` : value}
