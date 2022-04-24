# Custom Filters Component

Custom Filters Component renders the filters that need to be displayed on the Grid.
You need to pass this <CustomFilters /> component in the 'filters' prop of SimpleGrid component if you want to render filters conditionally using 'Add filters' button.
This component contains a 'componentsMap' that will contain an array of input components that can be displayed as filters. We loop into this array and display the filters accordingly.
Currently, the below react-admin inputs have been added and imported-
const componentsMap = {
SearchInput,
SelectInput,
TextInput,
};
If in future , any other input component other than these are required to be shown as filters, they need to be added in this 'componentsMap' and should be imported in this file.

## Required Props

Custom Filters Component needs the following props to render the filters on the grid -

1. filtersForGrid : This is a configuration object containing the array input components that are required to be displayed as filters for that particular list. This is a required prop in order to show filters otherwise by default a 'Search' filter appears.
   E.g.,
   const filtersForGrid = [
   {
   type: "SearchInput",
   source: "q",
   alwaysOn: true,
   placeholder: translate("party_list_search"),
   },
   {
   type: "SelectInput",
   label: translate("status"),
   source: "status",
   alwaysOn: false,
   choices: [
   { id: true, name: translate("active") },
   { id: false, name: translate("inactive") },
   ],
   },
   ];

   These input objects should contain all the props required by the type of react-admin input component.
