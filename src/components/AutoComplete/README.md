# Auto Complete

Auto Complete component renders a normal text input enhanced by a panel of suggested options.

## Props

Auto Complete Row needs the following props to render -

1. apiParams :

- This prop is used to for passing api information.
- Eg. type, fieldName

2. label :

- This is a text message which appears as placeholder.

3. autoCompleteClass :

- className for styling autocomplete.

4. value :

- Value of text input.

5. onOpen:

- This is a boolean value passed to the auto complete component when its true function is called.
  icon.
- Eg. onOpen={true}

6. optionData:

- when option is not available from component then pass through props, and pass optionsFromParentComponent from parent component.

7. onOpenCall

- when we want to write custom on open function then pass through this prop.

8. required

- used for validation.

9. errorMsg

- when we want to show error message set this is true.

10. errorMsgClass

- className for styling error message.

11. additionalFilters

- to pass extra filters if more than 1 is needed
- must be passed as an Array of object & it is optional
- Eg. additionalFilters={[{ fieldName: "tagTypeId", operatorName: "Like", fieldValue: "D" }]}
