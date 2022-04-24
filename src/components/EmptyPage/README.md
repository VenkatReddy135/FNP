# Empty Page

Empty Page component renders a react-admin empty page component when there is no record on list page.
It will only show No result found message and action buttons.

## Props

Empty Page needs the following props -

1. actionButtonsForEmptyGrid :

- This is an array of configuration object for the action buttons you want to render with your Grid.
  The default value for the prop is null.
  For example: 
  {
  type: "CreateButton",
  label: translate("new_category"),
  icon: <></>,
  className: classes.buttonStyle,
  },
