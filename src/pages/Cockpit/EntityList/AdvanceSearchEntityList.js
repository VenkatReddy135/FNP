/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState, useEffect } from "react";
import { Button, TextField, Typography, Grid, Divider } from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslate, useNotify } from "react-admin";
import useStyles from "../../../assets/theme/common";
import SearchFieldCreator from "../../../components/SearchFieldCreator";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { TIMEOUT } from "../../../config/GlobalConfig";
/**
 * Advanced search tool
 *
 * @returns {React.Component} //return component
 */
const AdvanceSearchEntityList = () => {
  const classes = useStyles();
  const notify = useNotify();
  const translate = useTranslate();
  const { search } = useLocation();
  const history = useHistory();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const [state, setState] = useState({
    dropDownFields: [],
    operatorList: [
      { label: translate("equalTo"), value: "EqualTo" },
      { label: translate("notEqualTo"), value: "NotEqualTo" },
      { label: translate("in"), value: "In" },
      { label: translate("notIn"), value: "NotIn" },
    ],
    filterList: [],
    inputValue: {},
    typeObject: {},
  });
  const [entityGroupName, entityName] = (query.get("entityId") || "").split("|");
  const metaData = query.get("metadata");
  const dbType = query.get("dbType");
  const entityNameLabel = translate("entityName");
  const entityGroupNameLabel = translate("entityGroupName");

  const [breadcrumbsList] = useState([
    {
      displayName: translate("entityEngineGridTitle"),
      navigateTo: `/${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
    },
    {
      displayName: entityName,
      navigateTo: `/${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/query/select?dbType=${dbType}&entityId=${entityGroupName}|${entityName}`,
    },
    {
      displayName: translate("advance_search"),
    },
  ]);

  const { dropDownFields, operatorList, inputValue, filterList } = state;

  useEffect(() => {
    const typeObject = {};
    const metaTemp = JSON.parse(metaData);
    const dropDownFieldsTemp = [];
    metaTemp?.data?.map((val) => {
      typeObject[val?.fieldName] = val?.fieldType;
      return dropDownFieldsTemp.push({ label: val.fieldName, value: val.fieldName });
    });
    setState((prevState) => ({ ...prevState, dropDownFields: [...dropDownFieldsTemp], typeObject: { ...typeObject } }));
  }, []);

  /**
   * Function to call the action for updating selected entity group
   *
   * @name onAddtition
   */
  const onAddtition = () => {
    let validationError = false;
    const data = state.inputValue;
    if (!Object.entries(data).length) {
      validationError = true;
    }
    Object.entries(data).forEach(([, value]) => {
      if (!value) {
        validationError = true;
        return false;
      }
      return true;
    });
    if (!validationError) {
      const tempList = [...state.filterList];
      tempList.push({ ...data });
      setState((prevState) => ({
        ...prevState,
        filterList: [...tempList],
        inputValue: {},
      }));
    } else {
      notify(translate("fill_required_field"), "error", TIMEOUT);
    }
  };

  /**
   * Function to call the action for adding filter item
   *
   * @name handleChangeInput
   * @param {object} event DOM event
   */
  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    if (name) {
      setState((prevState) => ({ ...prevState, inputValue: { ...prevState.inputValue, [name]: value } }));
    }
  };

  /**
   * Function to call the action for updating filter list
   *
   * @name handleChangeList
   * @param {object} event DOM event
   * @param {number} id filter index value of array
   */
  const handleChangeList = (event, id) => {
    const { name, value } = event.target;
    if (name) {
      const tempList = [...state.filterList];
      tempList[id] = { ...tempList[id], [name]: value };
      setState((prevState) => ({ ...prevState, filterList: [...tempList] }));
    }
  };

  /**
   * Function to call the action for updating selected entity group
   *
   * @name onDeletion
   * @param {number} index filter index value of array
   */
  const onDeletion = (index) => {
    const tempList = [...state.filterList];
    if (index > -1) {
      tempList.splice(index, 1);
    }
    setState((prevState) => ({ ...prevState, filterList: [...tempList] }));
  };

  /**
   * Function to generate base64 of filters
   *
   * @name generateFilter
   * @returns {boolean} true / false
   */
  const generateFilter = () => {
    const tempList = state.filterList;
    const filterArray = [];
    const { typeObject } = state;
    if (inputValue.selectedColumn && inputValue.selectedColumn && inputValue.searchValue) {
      tempList.push({ ...inputValue });
    }
    tempList.map((val) => {
      const tempObj = {};
      const columnType = typeObject[val.selectedColumn];
      const containsAt = val.selectedColumn.includes("_at");
      let isMultiValues = false;
      tempObj.name = val.selectedColumn;
      tempObj.operation = val.selectedOperator;
      if (tempObj.operation === "In" || tempObj.operation === "NotIn") {
        isMultiValues = val.searchValue.includes(",");
      }
      tempObj.type = columnType === "DATETIME" || columnType === "Date" || containsAt ? "date" : "string";
      tempObj.values = !isMultiValues ? [val.searchValue] : [...val.searchValue.split(",")];
      filterArray.push(tempObj);
      return true;
    });
    if (!filterArray.length) {
      history.goBack();
      return false;
    }
    const filter = { filter: btoa(JSON.stringify({ conditions: filterArray })) };

    history.push(
      `/${
        window.REACT_APP_COCKPIT_SERVICE
      }entitygroups/entities/query/select?dbType=${dbType}&entityId=${entityGroupName}|${entityName}&filter=${JSON.stringify(
        filter,
      )}`,
    );
    return true;
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <Grid container direction="column" spacing={1} justify="space-between" className={classes.gridStyle}>
        <Grid item>
          <Typography variant="h5" className={classes.gridStyle}>
            {entityName}
          </Typography>
          <Divider variant="fullWidth" className={classes.dividerStyle} />
        </Grid>
        <Grid item className={classes.customMargin}>
          <TextField label={entityNameLabel} value={entityName} disabled />
          <TextField label={entityGroupNameLabel} className={classes.label} value={entityGroupName} disabled />
        </Grid>
        <Grid item>
          <Divider variant="fullWidth" className={classes.dividerStyle} />
        </Grid>
        <Grid item>
          <SearchFieldCreator
            columnList={dropDownFields}
            operatorList={operatorList}
            selectedColumn={inputValue.selectedColumn}
            selectedOperator={inputValue.selectedOperator}
            searchValue={inputValue.searchValue}
            onSubmit={onAddtition}
            handleChange={handleChangeInput}
          />
        </Grid>
        {filterList.map((val, index) => (
          <Grid item key={val.selectedColumn}>
            <SearchFieldCreator
              key={val.selectedColumn}
              columnList={dropDownFields}
              operatorList={operatorList}
              selectedColumn={val.selectedColumn}
              selectedOperator={val.selectedOperator}
              searchValue={val.searchValue}
              fieldItem
              handleChange={(e) => {
                handleChangeList(e, index);
              }}
              onSubmit={() => {
                onDeletion(index);
              }}
            />
          </Grid>
        ))}
        <Grid item className={classes.listStyle}>
          <Button
            variant="outlined"
            size="medium"
            className={classes.actionStyle}
            data-at-id="cancelButton"
            onClick={() => {
              history.goBack();
            }}
          >
            {translate("cancel")}
          </Button>
          <Button
            variant="contained"
            size="medium"
            className={classes.actionButtonStyle}
            data-at-id="actionButton"
            onClick={generateFilter}
          >
            {translate("apply")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AdvanceSearchEntityList;
