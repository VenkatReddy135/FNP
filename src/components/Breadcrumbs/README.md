# BreadCrumb

BreadCrumb component allows user to navigate to previous screens.

## Props

This components requires one prop -

1. breadcrumbs :

- It is an array of objects containing links and displays names.
breadcrumbs prop expects array to be in the below form -
[
    { displayName: "Categories", navigateTo: "galleria/v1/categories" },
    { displayName: `${match.params.id}` },
]
If you don't add navigateTo property for an object then it would be rendered as <Typography/> else <Link/>.
