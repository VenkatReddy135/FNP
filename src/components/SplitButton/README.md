# Split Button

Split Button component renders action for dropdown options.

## Props

Split Button needs the following props to render the buttons -

1. label :

- This is the string value to be passed to display label for the split button.
  Eg. label="Preview"

2. options :

- This is the array of object to be passed to display label for the dropdown field.
  Eg. options= [
  { id: 10, name: "Top 10 Items" },
  { id: 20, name: "Top 20 Items" },
  ]

3. onSelect :

- This is a callback function which gets invoked on the click event of dropdown field.
  Eg. onClick={() => handleMenuItemClick(index)}

  const handleMenuItemClick = (index) => {
  onSelect();
  }
