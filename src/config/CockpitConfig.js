export default {
  dbType: {
    mysql: "mysql_database",
    mongo: "mongo_database",
    arango: "arango_database",
  },
  dbKey: {
    id: "id",
    mongoId: "_id",
    key: "_key",
  },
  crudOperationType: {
    insert: "INSERT",
    delete: "DELETE",
    edit: "UPDATE",
    select: "SELECT",
  },
  sqlDisabledValues: ["created_at", "updated_at", "created_by", "updated_by"],
  entityGroupsRoute: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
  entitiesRoute: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities`,
  pageSize: 10,
};
