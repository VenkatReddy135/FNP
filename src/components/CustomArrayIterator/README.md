# CustomArrayIterator

Custom Array Iterator renders a list of objects where you want a delete feature to delete and add new record.

## Props

Create Modal needs the following props to render the dialog component -

1. index :

- index of every object in the array of objects.

2. optionsData :

- This is a array of canonical data. For eg (["SELF", "REFERENCE"]);

3. isDisabled:

- This is a flag to disable editing any record from the list.

4. selectInputLabel

- This is the label to render for the select dropdown for canonical data.

5. deleteClick

- This is the callback function which is invoked on click of delete icon
  (Eg. onClick={() => deleteClick(index)}).

6. isDisplayDeleteButton

- This is a flag to render the delete icon for a particular icon.

7. handleSelectInputChange

- This is a callback function which is invoked when the value from the select dropdown is changed.
  Eg. onChange={(event) => handleSelectInputChange(event, index)}

8. handleTextInputChange

- This a callback function which is invoked when the value of the text input is changed.
  Eg. onChange={(event) => handleTextInputChange(event, index)}

9. textInputLabel

- This is the label which is displayed for the text input.

10. selectInputValue

- This is the selected value for the canonical data which can be either (Eg. SELF or REFERENCE).

11. textInputValue

- This is the value which is displayed on text input which is the canonical url. (Eg. https://fnp.com/gifts/mothers-day)
