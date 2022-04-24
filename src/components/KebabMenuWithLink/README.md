# Kebab Menu With Link

Kebab Menu With Link renders the component for Kebab Menu Icon with Link, on clicking which opens a dialog containing menu item links.

## Props

Kebab Menu With Link needs the following props -

1. configurationForKebabMenu :

- This is array of object which contains the option list of menu.
  The default value is null.
  For example:
  const configurationForKebabMenu = [
  {
  id: "1",
  type: "View",
  leftIcon: <RemoveRedEyeOutlinedIcon />,
  path: "",
  routeType: "/show",
  isEditable: false,
  },
  { id: "2", type: "Edit", leftIcon: <EditOutlinedIcon />, path: "", routeType: "/update", isEditable: true },
  { id: "3", type: "Delete", leftIcon: <DeleteOutlineOutlinedIcon />, path: "", routeType: "" },
  ];

2. optionsList :

- This is an array of configuration object for option values.
  For example:
  {optionsList.map((option) => {
  let path;
  if (option.type === "Delete") {
  path = "";
  } else {
  path = `/${resource}/${rowId}${option.routeType}`;
  }
  }

3. tabPath :

- This is a string type which takes the tabPath value for pathname.
For example:
 <Link
 to={{
 pathname: `/${resource}/${rowId}${tabPath}`,
 isEditable: false,
 id: record.id,
 }}
>

4. resource :

- This is a string type which takes the resouce value for path.
  For example:
  pathname: `/${resource}/${rowId}${tabPath}`,

5. source :

- This is a string type which contains the source value that gets passed from the config object for the grid.
  For example:
  getRowValue(record, source);
