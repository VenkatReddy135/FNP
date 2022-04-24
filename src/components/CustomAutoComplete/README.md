# Custom Auto Complete

Custom Auto Complete component renders a normal text input enhanced by a panel of suggested options.

## Props

Custom Auto Complete Row needs the following props to render -

1. apiParams :

- This prop is used to for passing api information.
  Eg. type, fieldName

2. label :

- This is a text message which appears as placeholder.

3. autoCompleteClass :

- className for styling autocomplete.

4. disabled :

- Boolean value to disable the field as per the condition.

5. multipleSelect :

- Boolean value if true then multi select will work.

6. limitTags :

- Number value sets the number of item display on autocomplete and rest select will show as ellipses.

7. additionalFilter :

- to pass extra filters if more than 1 is needed
- must be passed as an Array of object & it is optional
- Eg. additionalFilters={[{ fieldName: "tagTypeId", operatorName: "Like", fieldValue: "D" }]}

8. dataId :

- This is id for the component.

9. labelName :

- This is name of field to be displayed as a label in a dropdown.
  e.g. labelName="name"

10. clearOnBlur :

- Boolean value to enable/disable the clearOnBlur functionality.

11. onSearchInputChange :

- This allows to pass a onSerachInputChange callback function to get input text as user types in.

12. defaultOptions :

- This allows to pass options/choices for dropdown to show. If you pass this prop then this component will not hit server API in any case(means it will ignore apiParams if you pass this prop).
