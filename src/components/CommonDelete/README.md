# Common Delete

Common Delete component renders a confirm dialog component which expects a confirmation from user to delete a certain
record in a grid or its detail page.

## Props

Common Delete Row needs the following props to render the delete dialog component -

1. resource :

- This prop is used to for passing it to the dataProvider delete function.
- Eg. galleria/categories/associations

2. deleteText :

- This is a text message which appears on the dialog component. (Eg. Are you sure you want to delete this tag?).

3. redirectPath :

- redirectPath is the route to which we will navigate the application after a selected record is deleted.
- Eg. redirectPath={` /galleria/categories/associations/categories/${id}/show/relationship`}

4. params :

- This is an object containing the id of the selected record which the user wants to delete from the list of records.
- Eg. {id: 2000014}

5. open:

- This is a boolean value passed to the dialog component to display the dialog component after user clicks on delete
  icon.
- Eg. open={open}

6. close:

- This is a function which is invoked on the close of the dialog component.
- Eg. onClose={close}

7. list

- This is a boolean value to check if the user is deleting a record from the list of records or from the details page of that
  record.
- Eg. if (res.data && res.status === "success" && list) {
  notify(res.data.message || translate("delete_success_message"));
  refresh();
  }
