/* eslint-disable no-restricted-syntax */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslate, useQuery, useMutation, useNotify } from "react-admin";
import { Typography, Grid, Chip } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DialogBox from "../../../components/DialogBox";
import Breadcrumbs from "../../../components/Breadcrumbs";
import useStyles from "../../../assets/theme/common";
import ExportForm from "./exportFrom";
import ExportGrid from "./exportGrid";
import { TIMEOUT, DROPDOWN_PER_PAGE } from "../../../config/GlobalConfig";

const mappedArray = new Map();
/**
 * Parent component of Export Section where all the functionalities and call are being implemented.
 *
 * @returns {React.ReactElement} returns a Export component
 */
const Export = () => {
  const initialData = {
    selectedEntityGroup: "",
    selectedEntityName: "",
    selectedExportFileFormat: "",
    selectedOperator: "",
  };
  const [inputData, setInputData] = useState(initialData);
  const [isApplied, setIsApplied] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [open, toggleModal] = useState(false);
  const [selectedColumnField, setSelectedColumnField] = useState("");
  const [data, setData] = useState("");
  const [chipArray, setChipArray] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [operationType, setOperationType] = useState("");
  const [searchedResult, setSearchedResult] = useState([]);

  const classes = useStyles();
  const notify = useNotify();
  const translate = useTranslate();
  const ExportTitle = translate("exportTitle");
  const excludeCol = translate("exclude_export_col");
  const attributeCodeCol = translate("attribute_code_export_col");

  const [breadcrumbsList] = useState([
    {
      displayName: translate("entityEngineGridTitle"),
      navigateTo: `/${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
    },
    {
      displayName: ExportTitle,
    },
  ]);

  useEffect(() => {
    if (searchInput === "") setSearchedResult(rowData);
  }, [rowData, searchInput]);
  const { data: entityGroupsData } = useQuery(
    {
      type: "getData",
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroupnames`,
    },
    {
      onFailure: () => {
        notify(translate("somethingWrong"), "error", TIMEOUT);
      },
    },
  );
  const entityGroups = useMemo(() => (entityGroupsData || { data: [] }).data, [entityGroupsData]);
  const { data: responseEntityName } = useQuery(
    {
      type: "getList",
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
      payload: {
        filter: {
          entityGroupName: inputData.selectedEntityGroup,
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
  const [getMetaData] = useMutation(
    {
      type: "getData",
      payload: { entityName: inputData.selectedEntityName, entityGroupName: inputData.selectedEntityGroup },
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/meta-data`,
    },
    {
      onSuccess: (res) => {
        const metaDataForGrid = res?.data.data;
        setRowData(
          metaDataForGrid.map(({ fieldName, fieldType }, idx) => {
            return {
              attributeCode: fieldName,
              filter: fieldType,
              id: idx + 1,
            };
          }),
        );
      },
      onFailure: (error) => notify(`Error: ${error.message}`, "error", TIMEOUT),
    },
  );
  const [mutate] = useMutation();
  /**
   * @function modifiedPayload Method invokes when export button is clicked.
   * @param {object}payloadData value by which row data is excluded from data grid.
   * @returns {object} modified payload object.
   */
  const modifiedPayload = (payloadData) => {
    const payload = {
      exportFileFormat: inputData.selectedExportFileFormat,
      entityGroupName: inputData.selectedEntityGroup,
      entityName: inputData.selectedEntityName,
      filter: payloadData,
    };
    if (selectionModel.length) {
      return {
        ...payload,
        excludeFields: selectionModel.join(","),
      };
    }
    return payload;
  };

  /**
   * @param {object}payloadData value by which row data is excluded from data grid.
   * @function postExport Method invokes when export button is clicked.
   * @returns {Function} a callback.
   */
  const postExport = (payloadData) =>
    mutate(
      {
        type: "getOne",
        resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/query/export`,
        payload: modifiedPayload(payloadData),
      },
      {
        onSuccess: (res) => {
          notify(res?.data?.message || translate("file_import_success"), "success", TIMEOUT);
        },
        onFailure: (error) => notify(`${translate("error")}: ${error.message}`, "error", TIMEOUT),
      },
    );
  /**
   * @function onApplyChange Method invokes when Apply button is clicked in order to get the Datagrid
   */
  const onApplyChange = useCallback(() => {
    getMetaData();
    setIsApplied(true);
  }, [setIsApplied, getMetaData]);
  /**
   * @function handleExport Trigger when Export button is clicked
   */
  const handleExport = useCallback(() => {
    const filteredArrayData = { conditions: [] };
    for (const [key, value] of mappedArray) {
      filteredArrayData.conditions = [
        ...filteredArrayData.conditions,
        {
          name: key,
          operation: value.operationType || "In",
          type: "string",
          values: value.element,
        },
      ];
    }
    const payloadData = mappedArray.size ? btoa(JSON.stringify(filteredArrayData)) : "";
    postExport(payloadData);
  }, [postExport]);
  /**
   * @function handleKeyUp Method invokes when User press enter on the Textfield in the modal.
   * @param {object } e Object that is used in handleKeyUp Method.
   */
  const handleKeyUp = (e) => {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      if (data !== "") {
        if (chipArray.length === 0) {
          setChipArray([data.trim()]);
        } else {
          const result = chipArray.includes(data.trim());
          setChipArray(result ? [...chipArray] : [...chipArray, data.trim()]);
        }
        setData("");
      }
    }
  };
  /**
   * @function handleDelete Method invokes when User press Cross Icon  on the Chip in the Datagrid
   * @param {string }selectedValue  value after clicking the chip's delete button.
   * @param {number }id  value after clicking the chip's delete button.
   */
  const handleDelete = (selectedValue, id) => {
    const { operationType: operation, element } = mappedArray.get(id) || {};
    const array = open ? chipArray : element;
    const filteredArray = array.filter((i) => i !== selectedValue);
    setChipArray([...filteredArray]);
    if (mappedArray.get(id)) {
      if (filteredArray.length) {
        mappedArray.set(id, { operationType: operation, element: filteredArray });
      } else {
        mappedArray.delete(id);
      }
    }
  };

  /**
   * @function handleAction Method invokes when User press Filter Button in Modal */
  const handleAction = () => {
    if (chipArray.length) {
      mappedArray.set(selectedColumnField, { operationType: inputData.selectedOperator, element: [...chipArray] });
    }
    setChipArray([]);
    setInputData({ ...inputData, selectedOperator: "" });
    toggleModal(false);
  };

  /**
   * @function handleClose Method invokes when User press Cancel Button in Modal */
  const handleClose = () => {
    toggleModal(false);
    setData("");
    setInputData({ ...inputData, selectedOperator: "" });
  };

  /**
   * @param {string}newSelection value by which row data is excluded from data grid.
   * @function handleRowSelection Method invokes when row is selected.
   */
  const handleRowSelection = useCallback(
    (newSelection) => {
      if (typeof newSelection === "string") {
        setSelectionModel((prevValue) => {
          const filteredArray = prevValue.filter((i) => i !== newSelection);
          const isSelected = prevValue.length === filteredArray.length;
          return !isSelected ? [...filteredArray] : [...prevValue, newSelection];
        });
      }
    },
    [selectionModel],
  );

  /**
   * @function handleOnEditFields Method triggers when user click on Parent Edit button to change the Entity Value and Entity Name.
   */
  const handleOnEditFields = useCallback(() => {
    setIsApplied(false);
  }, [isApplied]);
  /**
   * Function to update the state of input fields dynamically
   *
   * @name handleInputChange
   * @param {object}e synthetic event
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setInputData((prev) => {
      return { ...prev, [name]: value };
    });
    const selectedName = ["selectedExportFileFormat", "selectedOperator"];
    if (!selectedName.includes(name)) {
      mappedArray.clear();
      setSelectionModel([]);
    }
  }, []);

  /**
   * @param {string}text value by which row data is filtered in data grid.
   * @function handleSearch Method used to search for attribute code in the data grid.
   */
  const handleSearch = useCallback(
    (text) => {
      const searchedArray = rowData?.filter((i) => i.attributeCode.includes(text));
      setSearchedResult(searchedArray);
    },
    [searchedResult],
  );
  const columnData = [
    {
      field: "exclude",
      headerName: excludeCol,
      flex: 0.1,
      renderCell: (params) => {
        const id = params.row.attributeCode;
        const isSelected = selectionModel.includes(id);
        return (
          <input
            style={{ cursor: "pointer" }}
            type="checkbox"
            defaultChecked={isSelected}
            onChange={() => handleRowSelection(id)}
          />
        );
      },
    },
    { field: "attributeCode", headerName: attributeCodeCol, flex: 0.3 },
    {
      field: "filter",
      headerName: translate("filter"),
      flex: 0.6,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const {
          row: { attributeCode },
        } = params;
        /**
         * @function onClick Method invokes when Apply button is clicked in order to get the Datagrid
         */
        const onClick = () => {
          setSelectedColumnField(attributeCode);
          toggleModal(true);
          setChipArray(mappedArray.get(attributeCode)?.element ? mappedArray.get(attributeCode)?.element : []);
          setOperationType(mappedArray.get(attributeCode)?.operationType || "In");
        };
        return (
          <Grid container>
            {mappedArray.get(attributeCode)?.element?.map((i) => (
              <Chip className={classes.chipGap} key={i} label={i} onDelete={() => handleDelete(i, attributeCode)} />
            ))}
            <EditOutlinedIcon className={classes.chipGap} onClick={onClick} />
          </Grid>
        );
      },
    },
  ];
  const handleExportSearch = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);

  const appliedRowFilter = JSON.stringify(mappedArray.get(selectedColumnField) || []);
  const selectedRow = JSON.stringify(selectionModel);
  const memoColumnData = useMemo(() => {
    return columnData;
  }, [appliedRowFilter, selectedRow]);

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <Grid>
        <Typography variant="h5" className={classes.gridStyle}>
          {ExportTitle}
        </Typography>
        <Grid item className={classes.headerClass}>
          <ExportForm
            entityGroups={entityGroups}
            onApplyChange={onApplyChange}
            entityNameData={responseEntityNames}
            isApplied={isApplied}
            handleOnEditFields={handleOnEditFields}
            onHandleExportFormValidation={!(inputData.selectedEntityName && inputData.selectedExportFileFormat)}
            handleInputChange={handleInputChange}
          />
          {isApplied && rowData ? (
            <ExportGrid
              rowData={searchedResult}
              columnData={memoColumnData}
              searchInput={searchInput}
              onRowSelected={handleRowSelection}
              handleExport={handleExport}
              setSearchInput={handleExportSearch}
              handleSearch={() => handleSearch(searchInput)}
            />
          ) : (
            ""
          )}
        </Grid>
      </Grid>
      <DialogBox
        showButtons
        closeText={translate("cancel")}
        actionText={translate("filter")}
        openModal={open}
        selectedEntityName={inputData.selectedEntityName}
        selectedEntityGroup={inputData.selectedEntityGroup}
        selectedColumnField={selectedColumnField}
        handleClose={handleClose}
        setData={setData}
        handleKeyUp={handleKeyUp}
        chipArray={chipArray}
        operationType={inputData.selectedOperator || operationType}
        value={data}
        handleDelete={handleDelete}
        handleAction={handleAction}
        handleOperatorChange={handleInputChange}
      />
    </>
  );
};

export default Export;
