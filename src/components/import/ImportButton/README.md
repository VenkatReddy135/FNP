# ImportButton

ImportButton is a component for Import button with an Expand icon, on click of Expand Icon opens a dialog of menu items

## Props

ImportButton needs the following props -

1. onClick:

- This is the handler which performs an action depending upon the option clicked
- It is a function type field

  const handleMenuItemClick = (event) => {
  setAnchorEl(event.currentTarget);
  };

2. configurationForExpandMenu :

- This contains the labels required for the buttons
- It is an array type field
  e.g.,
  const configurationForExpandMenu = [translate("import"), translate("export")];
