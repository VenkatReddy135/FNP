# Generic Tab

Generic Tab component renders the array of tabs with the route associated with it.

## Props

Generic Tab needs the following props -

1. tabArray :

- This is an array of configuration object for the tabs which consistes of key, title and path for tab.
For example:
const tabArray = [
  {
    key: "categories",
    title: "GALLERIA",
    path: `/galleria/v1/categories`,
  },
]

2. Location :

- This is an object of pathnames for the tabs.

3. isScrollable: 
- To show the scroll to tabs if that are longer than screen resolution.

For example:
<Route path={location.pathname} component={() => <element.componentToRender {...props} />} />
