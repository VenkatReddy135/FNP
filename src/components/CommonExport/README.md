# Common Export

Common Export component renders a confirm dialog component which shows the export message and expects a confirmation from user to OK or Cancel the dialog box.

## Props

Common Export needs the following props to render the export dialog component -

1. resourceVal :

- This prop is used to for passing it to the dataProvider export function.
- Eg. galleria/categories/associations

2. payload:

- This is an object field which contains query params required to export API
- e.g., payload={{ exportFileFormat: "csv", categoryId: id, simpleSearchValue: "" || filterVal }}

3. resetVal :

- This prop is used to for resetting the value of IsExport to false.
- This is called inside the toggleModalHandler function to reset value.
- Eg. resetVal()
