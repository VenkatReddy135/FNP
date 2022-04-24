# Dropdown

Dropdown component renders the selectInput.

## Props

Custom Date Time Field needs the following props to render the date/time value -

1. label :

- This is the string value to be passed to display label for the dropdown field.

2. value :

- This is the value which is the default value for the dropdown field.
  Eg. defaultValue={value}

3. data:

- This is the array containing the items to be rendered in the dropdown field.

4. edit:

- This is the flag to show label and value if the parent component is rendered in view mode.

5. onSelect:

- This is the callback function which will be invoked onChange of dropdown field.
  Eg. onChange={onSelect}

6. validate:

- validate is the object to validate select dropdown for any required field restriction.

7. className:

- pass custom styling to the component.

8. gridSize:

- custom responsive grid sizes
  Eg. gridSize={{ xs: 12, sm: 4, md: 4 }}
