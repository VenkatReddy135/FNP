# Common Import

Common Import component renders a content which includes file selection to select a single file for import.

## Props

Common Dialog Content needs the following props to render the dialog message -

1. returnFileName :

- The returnFileName is a callback function which is invoked when a user selects a particular file from the file system for import.
  This function returns the file Object back to the parent component from where CommonImport component was rendered.
- Eg. props.returnFileName(fileInput.current.files[0]);
