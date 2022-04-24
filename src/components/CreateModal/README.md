# Create Modal

Create Modal component renders a Material-ui dialog component for displaying a combination of confirm box as well as a
read-only alert box.

## Props

Create Modal needs the following props to render the dialog component -

1. openModal :

- openModal is a boolean value which is passed to the open prop of dialog to open render a dialog.
- Eg. open={props.openModal}

2. handleClose :

- This is a callback function which is invoked when the dialog component is closed on click of close icon or
  cancel button
- Eg. onClose={props.handleClose}

3. dialogTitle

- This is the title message which is displayed on the dialog which is a configurable string message.

4. delete

- This is a flag to check if we want to conditionally display a delete read-only icon or not.

5. dialogContent

- This contains the actual content to be rendered on the dialog component which can be either a message
  literal or a different component altogether.
- Eg. {props.dialogContent}

6. showButtons

- This is a flag which is used to decide if we want any action buttons to be displayed on the dialog or not.
  This flag can be false if we want to render a read-only dialog with no actions.
- Eg {props.showButtons ? (
  <>
  <Button
  variant="outlined"
  size="medium"
  className={classes.actionStyle}
  data-at-id="cancelButton"
  onClick={props.handleClose}
  > {props.closeText}
  > </Button>
  > <Button
      variant="contained"
      size="medium"
      disabled={props.isDisable}
      className={classes.actionButtonStyle}
      data-at-id="actionButton"
      onClick={props.handleAction}
  >
      {props.actionText}
    </Button>
  </>
  ) : null}

7. closeText

- This is the text which needs to be displayed on the close or cancel action button.
- Eg {props.closeText}
