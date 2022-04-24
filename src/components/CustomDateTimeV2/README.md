# CustomDateTime

CustomDatetime for datetimepicker
supports all the props that are provided by ra-DateTimeInput
working is exactly similar to ra-DateTimeInput so Simpleform will work too

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

6. resetSignal:

- bool pass true value to clear the input field of component
- default false
- set to true then false

7. throwError:

- to pass custom error messages to component

example:
<DateTimeInput
source="thruDate"
label={translate("redirect_campaign.through_date")}
className={classes.formInputWidth}
onChange={handleDateChange}
validate={[required(), validateToDate(campaignDate.fromDate)]}
throwError="some error message"
/>
