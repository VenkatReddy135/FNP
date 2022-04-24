# TopHeaderWithStatus

TopHeaderWithStatus is a component for top header displaying category id as title, along with Workflow and Switch components. Also you can pass configuration to add action buttons to the component.

## Props

TopHeaderWithStatus needs the following props -

1. id :

- This contains the Category Id which can be passed to this component which will be shown as its Heading
- It is a string type field

2. isEnable :

- This contains IsEnabled field value coming from the api response.
- It is a boolean type field
  e.g., isEnable: null,

3. workflowStatus :

- This contains workflowStatus field value coming from api response
- It is a string field e.g.,
  workflowStatus: "",

4. showHeaderStatus :
   This is boolean prop which can be used to conditionally show this component.
   e.g., showHeaderStatus: false,

5. showButtons :
   This is a boolean prop which can be passed to show the action buttons conditionally
   e.g., showButtons: false,

6. actionButtonsForGrid :
   This contains an array of objects where you can configure the action buttons needed in the header.
   e.g.,
   const actionButtonsForGrid = [
   {
   type: "Button",
   label: translate("view_history"),
   variant: "outlined",
   onClick: onViewHistoryClickHandler,
   },
   ];
