# Simple Grid

Simple Grid component renders a react-admin List component with Customizable Datagrid. The List component has sortable columns and pagination that react-admin offers with the List.

## Props

Simple Grid needs the following props to render the grid -

1. configurationForGrid :

- This is an array of configuration object for the columns you want to render on your Grid. Each column object should contain at least the source, type and the label. In the 'source', you will provide the field name that you get from the API. The 'type' would contain the Type of component you want to render in that column and 'label' contains the title of the column header. For e.g.,  
   {
  source: "name",
  type: "TextField",
  label: "Name of the user"
  }
- If the type of the column is a custom component and it requires some custom props specific to that component, you can pass the same in the configuration object for that column.
- You can also add an onClickHandler in the configuration object, if you wish to add any click events for that particular column. For e.g.,
  {
  source: "website",
  type: "UrlField",
  onClick: onClickHandler
  }
- We loop on this 'configurationForGrid' array to render the grid columns. We have a 'componentsMap' in the simple grid component which contains the list of imported components you want to render in grid columns. Make sure to add the type of component you want to render in this 'componentsMap'.

2. actionButtonsForGrid :

- This is an array of configuration object for the action buttons you want to render with your Grid. The object must contain a 'type' prop to indicate the type of button component you want to render.
- You can add additional props in the object depending on your requirements. For e.g.,
  {
  type: "CreateButton",
  label: translate("new_category"),
  icon: <></>,
  className: classes.buttonStyle,
  },
- You can also add onClickHandlers in the object if you want to add a onClick event with the button.
  For e.g.,
  {
  type: "ImportButton",
  configurationForExpandMenu,
  onClick: onClickHandler,
  },
- If the type of the button is a custom component and it requires some custom props specific to that component, you can pass the same in the configuration object for that button.
- 'actionButtonsForGrid' array then gets passed to the GridActions component from the simple grid where we loop on this configuration array and render the button components. We have a 'componentsMap' in the GridActions component which contains the list of imported Button components. Make sure to add the type of button you want to render in this 'componentsMap'. For e.g.,
  const componentsMap = {
  CreateButton,
  ImportButton,
  Button,
  };

3. gridTitle :

- This contains the name you want to add in the Grid Title
- It is a string type field

4. filters :

- This prop is an optional prop which accepts a component that returns <Filter /> component need by the SimpleGrid list 'filters' prop.
- By default, this prop value is 'null'.
- If this prop is being passed from the list, it will be shown as Grid filters, otherwise the default <GridFilters/> component will display the filters (contains only a SearchInput).
- These filter values are further passed to <GridActions/> component to display filters using 'Add filter' option button.

5. showAddFilterButton:

- This flag determines whether you want to show the 'Add filter' button on the Simple Grid or not.
- If showAddFilterButton = true, 'Add filter' button will be shown.
  If showAddFilterButton = false (by default it is false), 'Add filter' button will not be shown.
- So if you want to show the 'Add filter' button, pass this prop 'showAddFilterButton' as true to <SimpleGrid /> from your list page component.
- We pass this 'filters' prop to <GridActions /> component based on this 'showAddFilterButton' prop value as shown below :
  <GridActions actionButtonsForGrid={actionButtonsForGrid} filters={showAddFilterButton ? filters : null} />
- If 'showAddFilterButton' is true, only then the Grid actions will show the 'Add filter' button and hence the filter component passed from list.

6. actionButtonsForEmptyGrid :

- This contains configuration array which is used for adding action buttons on the grid
- e.g., const actionButtonsForEmptyGrid = [
  {
  type: "CreateButton",
  label: translate("redirect_campaign.create_title"),
  icon: <></>,
  onClick: createHandler,
  variant: "outlined",
  },
  ];

7. searchLabel :

- This contains the string value which is passed to the gridFilter component as a label.
- e.g., searchLabel = translate("category_search_label");

8. resource :

- This contains the resource name for which the list will get rendered.
- e.g., resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}

9. bulkActionButtons :

- This is a boolean prop which is used to render action buttons conditionally
- bulkActionButtons: null,

10. sortField :

- This defines the sort field and its order
- sortField: { field: "id", order: "ASC" },

11. filters :

- This prop contains custom filter component value which user can pass to the grid
- e.g., filters={<DateAndSearchFilters searchLabel={viewHistorySearchLabel} {...props} />}

12. getFilter :

- This is handler function for the filter to fect filter value
- e.g., getFilter: () => {},

13. additionalLink :

- To add advancesearch we use this link
- This is optional
- e.g : <Link className={classesGlobal.redirectLink} to="/beautyplus/v1/advancesearch">
  <span className={classesGlobal.search}>Advanced Search</span>
    </Link>

14. limit :

- An element that is displayed if there is no data to show (default: <PaginationLimit>)
- This is optional
- e.g : pagination={<CustomPagination rowsPerPageOptions={paginationLimitValue} limit={limit} />}

## Customizable DataGrid

- We have used a third party component 'CustomizableDatagrid' from 'ra-customizable-datagrid' package. - - This component enables the hide/show functionality for the grid columns.
- This adds a ColumnIcon at the right top corner of the grid on click of which opens a dialog. This dialog contains the list of all the column names with a checkbox. The columns that are checked will be displayed in the grid & the unchecked columns will be hidden from the grid.
