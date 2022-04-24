# Common Button Row

Common Button Row component renders action buttons for cancel and update.

## Props

Common Button Row needs the following props to render the buttons -

1. onClickCancel :

- This is a callback function which gets invoked on the click event of cancel button.
  Eg. onClick={onClickCancel}

2. onClickUpdate :

- This is a callback function which gets invoked on the click event of update button.
  Eg. onClick={onClickUpdate}

3. updateBtnDisable :

- This is a boolean flag to disable or enable update button.
- If the value if true, then disable any click event on the button, else enable click event.
- Eg. disabled={updateBtnDisable}

4. create :

- This is a boolean flag to display actionButton text to either Create or Update depending on the flag value.
- If the create flag is true, then display button text as Create else display it as update.
- Eg. {create ? translate("create") : translate("update")}
