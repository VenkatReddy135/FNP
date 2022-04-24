# Menu Items Dialog

Menu Items Dialog renders the component for Kebab Menu Dialog contains list of menu items link.

## Props

Menu Items Dialog needs the following props -

1. anchorEl :

- This is of type object which contains the boolean value for opening the menu.
  The default value is null.
  For Example:
  anchorEl={true}

2. optionsList :

- This is an array of configuration object for option values.
  In case you do not want to redirect to any URL on click of kabab menu option, then pass 'noRedirect:true' flag then it will not redirect, its default value is false.
  For example:
  {optionsList.map((option) => {
  let path;
  if (option.type === "Delete" || option.noRedirect) {
  path = "";
  } else {
  path = `/${resource}/${rowId}${option.routeType}`;
  }
  }

3. rowId :

- This is a string type which takes the row Id value.
  For Example:
  rowId="216588"

4. resource :

- This is a string type which takes the resouce value for path.
  For Example:
  resource="categories"
