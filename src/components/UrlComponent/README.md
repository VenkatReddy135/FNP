# UrlComponent

UrlComponent is a Component which works as a dynamic Url Component which navigate user dynamically.

## Props

UrlComponent needs the following props -

1. record:

- This is of array type which holds the different types of values.

2. source :

- This works as an key of index of an array name record.
-

3. customPath:

- This provide us custom path for the component eg- "v1/entitygroups/entities".

4. basePathValue:

- Base path value gives us the base value of the component eg-"cockpit".

5. customQuerySource:

- This is Object type which may hold dbType and entityId eg:{ dbType: "dbType", entityId: "id" }
