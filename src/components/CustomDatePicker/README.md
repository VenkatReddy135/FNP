# CustomDatePicker

CustomDatePicker for datepicker

## Props

Create Modal needs the following props to render the dialog component -

1. source :

- source name from resource.

2. label :

- label for field

3. className:

- To set style of field.

4. onChange:

- To manipulate the user entered data.

5. validate:

- To add validator functions.

example:
<DatePickerInput
source="fromDate"
label={translate("from_date")}
className={classes.dateField}
onChange={(event) => updateCategoryObj({ ...categoryObj, fromDate: event.target.value })}
maxDate={categoryObj.thruDate || ""}
/>
