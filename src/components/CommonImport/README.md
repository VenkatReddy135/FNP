# Common Import

Common Import component implements the API calls required for uploading the file from list pages

## Props

1. payload :

- This is a object field which contains the query string params required for the import API.
- e.g., payload={{ fileType: "csv", specName: "CategoryImportJobSpec" }}

2. resource :

- This is string field which contains the API end point passed from the List page.
- e.g., resource="tusker/v1/presignedUrl"

3. resetImport :

- This is a callback function on Cancel button click to reset the flag on list page.
