# Custom Date Time Field

Custom Date Time Field component converts date/time into a readable format for datagrid.

## Props

Custom Date Time Field needs the following props to render the date/time value -

1. record :

- This the object which contains the date/time value for the record.
  (Eg. record = {
  createdAt: "2021/08/05T12:30:05",
  updatedAt: "2021/08/05T12:30:05",
  categoryName: "test",
  ...
  })

2. source :

- This is the property in the object which contains the datetime value.
  (Eg. record.createdAt, record.updatedAt)


3. externalStyle :

- This is callback function to return style for specific field.
  This is not required prop.
