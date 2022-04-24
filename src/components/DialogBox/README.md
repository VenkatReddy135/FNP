# DialogBox

This Component is used to show the custom dialog box of the export component

## Props

DialogBox needs the following props -

1. closeText:

- This field is of string type which refers to label of cancel button.

2. actionText :

- This field is of a string type which refers to label of the filter button

3. openModal :

- This field is of boolean type which tell when the modal need to be open or when it need to be closed

4. selectedEntityName :

- This prop shows the selected Entity Group Name which is selected by the user.

5. selectedEntityGroup :

- This props shows the selected Entity Group which is selected by the user.

6. selectedColumnField :

- This props shows the selected Column Field which is selected by the user.

7. handleClose:

- This is a Callback function which is used to close the Modal

8. setData :

- This is Callback function which is used to set the data.

9. handleKeyUp :

- This Callback is used to set the data when user press Enter button.

10. chipArray:

- This is of Array type in which we append the array based on the user input text.

11. handleDelete :

- This Callback works in order to delete the chip from the array

12. handleAction:

- This callback is used to save the value which is being filtered by the user.
