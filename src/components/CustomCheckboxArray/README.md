# Custom Checkbox Array

Custom checkbox list with select all feature

## Props

Custom checkbox Array needs the following props to render -

1. checkboxList :

- This prop is used to for checkboxes
- Eg. checkboxList={[
  { value: translate("blogs"), label: translate("blogs") },
  { value: translate("articles"), label: translate("articles") },
  { value: translate("staticInformationPages"), label: translate("staticInformationPages") },
  ]}

2. label :

- This is a text message which appears as placeholder.

3. className :

- className for styling .

5. row:

- This is a boolean value passed to the show as row or column
- Eg. onOpen={true}

6. onChange:

- onchange function

8. defaultValue:

- data from api on get call

9. edit

- edit mode setter

10. checkAllButton

- show select all

11. gridSize

- set grid size
