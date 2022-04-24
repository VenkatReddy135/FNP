/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useTranslate, useNotify } from "react-admin";
import { Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import CustomQueryForm from "./CustomQueryForm";
import cockpitConfig from "../../../config/CockpitConfig";
import useStyles from "../../../assets/theme/common";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { TIMEOUT, DROPDOWN_PER_PAGE } from "../../../config/GlobalConfig";

/**
 * Component used as Database engine which where any query can be executed based on the database, entity name, entity group selected.
 *
 * @returns {React.ReactElement} returns a Query Executer component
 */
const QueryExecuter = () => {
  const initialData = {
    databaseEngineName: "",
    selectedDatabaseName: "",
    selectedTableName: "",
    rows: "",
    query: "",
  };
  const [inputData, setInputData] = useState(initialData);
  const [queryData, setQueryData] = useState([]);
  const columnArray = [];

  const translate = useTranslate();
  const resultTitle = translate("resultTitle");
  const errorMsg = translate("errorMsg");
  const inserted = translate("recordInsertedSuccessfully");
  const updated = translate("recordUpdatedSuccessfully");
  const deleted = translate("recordDeletedSuccessfully");

  const classes = useStyles();
  const notify = useNotify();

  /* Api used to get the Entity Group Names Data */
  const { data: entityGroupNamesData } = useQuery(
    {
      type: "getList",
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
      payload: {
        filter: { dbType: inputData.databaseEngineName },
        pagination: {
          page: 1,
          perPage: DROPDOWN_PER_PAGE,
        },
        sort: {
          field: "entityGroupName",
          order: "asc",
        },
      },
    },
    {
      onFailure: () => {
        notify(translate("somethingWrong"), "error", TIMEOUT);
      },
    },
  );

  const { data: responseEntityName } = useQuery(
    {
      type: "getList",
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
      payload: {
        filter: {
          entityGroupName: inputData.selectedDatabaseName,
        },
        pagination: {
          page: 1,
          perPage: DROPDOWN_PER_PAGE,
        },
        sort: {
          field: "entityGroupName",
          order: "asc",
        },
      },
    },
    {
      onFailure: () => {
        notify(translate("somethingWrong"), "error", TIMEOUT);
      },
    },
  );

  const responseEntityNames = useMemo(() => responseEntityName, [responseEntityName]);

  const entityGroupNames = useMemo(() => [...new Set(entityGroupNamesData?.map((x) => x.entityGroupName))], [
    entityGroupNamesData,
  ]);

  /**
   * Function operationType to get the type of operation performed
   *
   * @name operationType
   * @returns {string} with message containing type of opration performed.
   */
  const operationType = () => {
    if (inputData.query.toLocaleLowerCase().includes("update")) {
      return updated;
    }
    if (inputData.query.toLocaleLowerCase().includes("insert")) {
      return inserted;
    }
    if (inputData.query.toLocaleLowerCase().includes("delete")) {
      return deleted;
    }
    return null;
  };

  const [getSqlQueryData] = useMutation(
    {
      type: "create",
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/query`,
      payload: {
        data: {
          dataObj: {
            limit: inputData.rows,
            queryType: "RAW_QUERY",
            rawQuery: inputData.query,
          },
          params: {
            entityGroupName: inputData.selectedDatabaseName,
            entityName: inputData.selectedTableName,
          },
        },
      },
    },
    {
      onSuccess: (response) => {
        const responseQueryData = response?.data?.data?.data;
        const updatedRows = response?.data?.data?.updatedRows;
        if (response.data && response.status === "success") {
          if (operationType()) {
            notify(`Success: ${updatedRows} ${operationType()}`, "success", TIMEOUT);
          }
          setQueryData(
            responseQueryData.map((item, idx) => {
              return { ...item, id: item.id || idx + 1 };
            }),
          );
        } else if (
          response.data &&
          response.data.errors &&
          response.data.errors[0].errorCode &&
          response.data.errors[0].message
        ) {
          notify(
            response.data.errors[0].field
              ? `${response.data.errors[0].field} ${response.data.errors[0].message}`
              : `${response.data.errors[0].message}`,
            "error",
            TIMEOUT,
          );
        }
      },
      onFailure: () => {
        notify(`Error: ${errorMsg}`, "error", TIMEOUT);
        setQueryData([]);
      },
    },
  );

  /**
   * Function to close the Dynamic Grid on Clicking the Close Button
   *
   * @name onHandleClose
   */
  const onHandleClose = React.useCallback(() => {
    setQueryData([]);
  }, [queryData]);

  if (queryData.length > 0) {
    const columnGenerator = queryData.slice(0, 1);
    columnGenerator.map((itr) => {
      return Object.keys(itr).map((columnField) => {
        const dynamicColumnObject = {
          field: columnField,
          width: 300,
          renderCell: (params) => {
            const { value } = params;
            if (typeof value === "object") {
              return <pre key={itr}>{JSON.stringify(value)}</pre>;
            }
            return <Typography key={columnField}>{value}</Typography>;
          },
        };
        if (typeof itr[columnField] === "object") {
          dynamicColumnObject.width = 500;
        }
        return columnArray.push(dynamicColumnObject);
      });
    });
  }

  /**
   * Function CustomQueryForm to update the state of input fields dynamically
   *
   * @name handleInputChange
   * @param {object}e synthetic event
   */
  const handleInputChange = React.useCallback((e) => {
    const { name, value } = e.target;
    if (name === "databaseEngineName") {
      setInputData((prev) => {
        return { ...prev, selectedDatabaseName: "" };
      });
    }
    setInputData((prev) => {
      return { ...prev, [name]: value };
    });
  }, []);
  const [breadcrumbsList] = useState([
    {
      displayName: translate("queryExecuterTitle"),
    },
  ]);

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <CustomQueryForm
        handleInputChange={handleInputChange}
        handleChange={getSqlQueryData}
        entityGroupNamesData={entityGroupNames}
        entityNames={responseEntityNames}
        databaseEngineName={inputData.databaseEngineName}
        onHandleClose={onHandleClose}
      />
      {queryData.length > 0 && (
        <>
          <Typography variant="h6">{resultTitle}</Typography>
          <div className={classes.grid}>
            <DataGrid rows={queryData} columns={columnArray} pageSize={cockpitConfig.pageSize} autoHeight />
          </div>
        </>
      )}
    </>
  );
};

export default QueryExecuter;
