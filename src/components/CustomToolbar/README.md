# Custom Toolbar

CustomToolbar component renders action buttons for cancel and create/update.

## Props

CustomToolbar needs the following props to render the buttons -

1. onClickCancel :

- This is a callback function which gets invoked on the click event of cancel button.
  Eg. onClick={onClickCancel}

2. onClickSubmit :

- This is a callback function which gets invoked on the click event of create/update button.
  Eg. onClick={onClickSubmit}

3. saveButtonLabel :

- This is the string text that is displayed as a label for Save button.
- Eg. saveButtonLabel={translate("create")}
