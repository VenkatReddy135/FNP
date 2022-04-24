# SearchFilterInput

Search Component contains Dropdowns and TextInput fields for finding specific documents

## Props

SearchFilterInput needs the following props to implement the search -

1. setSearchInput :

- This is the function which will be invoked onChange of dropdown & text field to update the state values.
  Eg.setSearchInput((prev) => {
  return { ...prev, [field]: value };
  });

2. searchCall:

- This is the callback function which will be invoked on submitting the form
  Eg. save={searchCall}

3.  menuItem:

- This is the array containing the items to be rendered in the dropdown field.

4. placeholder:

- This is the string value to be passed to display label for the dropdown field.
