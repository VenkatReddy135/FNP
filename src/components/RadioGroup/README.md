# Radio Group

Radio Group component renders the Generic Radio Group component.

## Props

Radio Group needs the following props -

1. label :

- This is of string type and takes the label for radio button.
  For Example:
  label= "Category Classification"

2. source :

- This is of string type and takes the mapping value.
  For Example:
  source= "CategoryName"

3. editable :

- This is of boolean type and checks if it is editable or not.
  For Example:
  editable= "true" //editable

4. choices :

- This is an array of objects type for radio button.
  For Example:
  choices = [
  {id: "MICRO", name:"MICRO"},
  {id: "PLP", name:"PLP"}
  ]

5. onChange :

- This is of functionn type and takes the value on radio button value change.
  For Example:
  onChange={(event) => onChange(event, source)}
  const onChange = (value, name) => {
  setUrl({ [name]: value });
  categoryObj.categoryClassification = value;
  updateCategoryObj({ ...categoryObj, categoryClassification: value });
  };

6. initialValue :

- This is the initial value of the radio button on page load.
  For Example:
  initialValue={MICRO}
