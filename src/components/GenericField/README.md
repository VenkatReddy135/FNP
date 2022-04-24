# GenericField

GenericField is a Component which identifies weather the component is Json field or Normal field and based on that it creates the field dynamically.

## Props

1. dbType:

- This is of string type which helps us to create the dynamic fields based on the type of database weather sql or non-sql.

2. configForEntitySqlForm :

- This is an Array of Object which holds the configuration for Sql Entity Form.
-

3. configForEntityNoSqlForm:

- This is an Object of Object which holds the configuration of Non Sql Entity like arango of mongo db.
