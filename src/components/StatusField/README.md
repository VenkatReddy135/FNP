# StatusField

StatusField renders list of status i.e Active, InActive, Expired etc.

## Rendering List of Status from response :

- Used to display status value in red and green color
- If status = true, the 'displayStatusText.trueText' will be displayed in green color.
  If status = false, the 'displayStatusText.falseText' will be displayed in red color.
- If one of the trueText or falseText , is not passed in the displayStatusText object, it will be shown as null.
- Props required by the component :
  1. displayStatusText: This is a required object prop by this component which contains an object of two keys -
  - trueText : This accepts a string text which user wants to display in case of 'true' status
  - falseText : This accepts a string text which user wants to display in case of 'false' status
  2.  source: 'source' value from response which we'll be using to fetch the status value
- For e.g.,
  {
  source: "name of Source",
  type: "StatusField",
  label: "Name of Column",
  displayTextIfTrue: "Active",
  displayTextIfFalse: "Inactive",
  }
