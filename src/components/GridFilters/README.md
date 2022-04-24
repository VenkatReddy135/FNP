# Grid Filters

Grid Filters component renders the filters that are needed to be displayed in simple grid.

## Props

Grid Filters needs the following props -

1. searchLabel :

- This is of string type and takes the label for search filter.
  For Example:
  searchLabel="Search by Category ID"

2. filterValues :

- This is an array of configuration object for filter values.
  The default is {}.
  For Example:
  filterValues=[
  {value: "Mix and Match"}
  ]

3. getFilterVal :

- This is a function which takes the filter values.
  For Example:
  const getFilterVal = (value) => {
  getFilter(value);
  };

4.  isSmallerSearch :

- This a boolean value which needs to be true if we need to display a smaller search field else false for normal search.
  For Example:

  className={isSmallerSearch ? classes.smallSearch : classes.search}

5. filterGridItems:

- This accepts array of react elements to view in-line with search bar
  For Example:

  const searchCheckBox = (
  <FormControlLabel
  className={classes.checkBoxClass}
  control={<Checkbox onChange={checkboxHandler} checked={searchByName} />}
  label={productFilterLabel}
  />
  );
  <SimpleGrid
  filterGridItems={[searchCheckBox]}
