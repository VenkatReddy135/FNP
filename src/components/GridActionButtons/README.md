# Grid Action Buttons

Grid Action Buttons Tab component renders the action button for grid.

## Props

Grid Action Buttons needs the following props -

1. actionButtonsForGrid :

- This is an array of configuration object for the action buttons you want to render with your Grid. The object must contain a 'type' prop to indicate the type of button component you want to render.
- You can add additional props in the object depending on your requirements.
  For Example:
  {
  type: "CreateButton",
  label: translate("new_category"),
  icon: <></>,
  className: classes.buttonStyle,
  },
- You can also add onClickHandlers in the object if you want to add a onClick event with the button.
  For Example:
  {
  type: "ImportButton",
  configurationForExpandMenu,
  onClick: onClickHandler,
  },
