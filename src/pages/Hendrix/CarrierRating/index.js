import React, { useState, useEffect, useRef, useCallback } from "react";
import { Divider, Grid, Typography } from "@material-ui/core";
import { useTranslate, useDataProvider, required, SimpleForm, useNotify } from "react-admin";
import PageHeader from "../../../components/PageHeader";
import CarrierTable from "./CarrierTable";
import SearchComponent from "../../../components/SearchComponent";
import SimpleModel from "../../../components/CreateModal";
import { useDeliveryMode } from "../hooks";
import CommonDialogContent from "../../../components/CommonDialogContent";
import { carrierFieldNameArray, bulkUpdate } from "../common";
import DropdownGroups from "../../../components/DropdownGroup";
import { TIMEOUT } from "../../../config/GlobalConfig";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/carrier-ratings`;

/**
 * Component for Carrier Rating
 *
 * @returns {React.ReactElement} returns a Carrier Rating component with datagrid
 */
const ViewCarrierRating = () => {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [deliveryModes, fetchDeliveryMode] = useDeliveryMode();
  const [importPopupFlag, toggleFlag] = useState(false);
  const [dialogObject, setConfirmDialog] = useState("");
  const translate = useTranslate();
  const [apiData, setApiData] = useState([]);
  const [selectedInput, setSelectedInput] = useState({
    deliveryMode: "",
  });
  const [searchInput, setSearchInput] = useState({
    fieldName: "",
    fieldValues: "",
    operator: "",
  });
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const dropDownListArray = [
    { id: 0, key: "deliveryMode", placeholder: translate("delivery_mode"), type: "Dropdown", Dataset: deliveryModes },
  ];

  useEffect(() => {
    fetchDeliveryMode("CR");
  }, [fetchDeliveryMode]);

  // to store pagination details
  const pageData = useRef();
  // to store updated rows
  const rowRef = useRef({ updatedRows: [] });

  /**
   * @function fetchData to Fetch data based on Payload change
   *
   *
   * @param {object} payload payload for api call
   * @returns {object} response
   */
  const fetchData = async (payload) => {
    const {
      data: { data, totalPages, total, currentPage },
    } = await dataProvider.getData(resource, payload);
    pageData.current = { totalPages, total, currentPage };
    return { data, totalPages, total, currentPage };
  };

  /**
   * @function to update dialogContents for popup based on event(bulkUpdate / cell validation)
   * @param {*} param0 props of the modal component
   *
   */
  const onUpdateCall = ({
    title = translate("update_config"),
    showButtons = true,
    closeText = translate("btn_cancel"),
    actionText = translate("btn_accept"),
  }) => {
    const dialogObj = {
      dialogContent: <CommonDialogContent message={title} />,
      showButtons,
      closeText,
      actionText,
    };
    setConfirmDialog(dialogObj);
    toggleFlag(true);
  };

  /**
   *
   * @function onBulkUpdateCall to make bulk update call with modified rows
   */
  const onBulkUpdateCall = async () => {
    await bulkUpdate(toggleFlag, rowRef, dataProvider, resource, notify, translate, TIMEOUT, setShowUpdateButton);
  };

  /**
   *
   * @function searchCall to fetch the filtered data based on the selected fieldValues
   * @returns {null | Array} null/Array
   */
  const searchCall = async () => {
    rowRef.current.updatedRows = [];
    const payload = {
      ...selectedInput,
      ...searchInput,
    };
    try {
      const { data } = await fetchData(payload);
      if (!data || data.length === 0) {
        setApiData([]);
      }
      setApiData(data);
    } catch (err) {
      return err.response ? err.response.data : null;
    }
    return null;
  };

  /**
   * @function onDropdownSelection To fetch the data based on selected deliveryMode and update the state   *
   * @param {string} key string value
   * @param {object} e event object
   * @param {object} type contains fieldname
   * @returns {null} null/Error
   */
  const onDropdownSelection = async (key, e, type) => {
    const { value } = e.target;
    setApiData([]);
    setShowUpdateButton(false);
    if (type === "Dropdown") {
      rowRef.current.updatedRows = [];
      setSearchInput({
        fieldName: "",
        fieldValues: "",
        operator: "",
      });
      const param = { deliveryMode: value };
      setSelectedInput(param);
      try {
        const { data, totalPages, total, currentPage } = await fetchData(param);
        pageData.current = { totalPages, total, currentPage };
        setApiData(data);
      } catch (err) {
        return err.response ? err.response.data : null;
      }
    }
    return null;
  };
  /**
   * @function handleModelClose to close the modal
   */
  const handleModelClose = useCallback(() => {
    toggleFlag(false);
  }, [toggleFlag]);
  return (
    <div data-testid="header">
      <PageHeader
        header={{
          ruleName: translate(`cr_ruleName`),
        }}
        buttonName={translate(`cr_updateButton`)}
        onUpdateClick={onUpdateCall}
        enableButton={showUpdateButton}
      />
      <SimpleForm toolbar={false}>
        {dropDownListArray.map((dropdownObj) => (
          <DropdownGroups
            key={dropdownObj.key}
            label={dropdownObj.placeholder}
            dropdownObj={dropdownObj}
            onDropdownSelection={onDropdownSelection}
            validate={[required()]}
          />
        ))}
      </SimpleForm>
      <Divider variant="fullWidth" />
      {(apiData?.length > 0 ||
        (searchInput.fieldValues && searchInput.fieldName && searchInput.operator) ||
        (searchInput.fieldName && searchInput.operator)) && (
        <>
          <SearchComponent
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            searchCall={searchCall}
            menuItem={carrierFieldNameArray}
            placeholder={translate("search_by_carrier")}
          />
          <Divider variant="fullWidth" />
          {apiData?.length > 0 ? (
            <CarrierTable
              apiData={apiData}
              selectedInput={selectedInput}
              searchInput={searchInput}
              fetchData={fetchData}
              pageData={pageData}
              onUpdateCall={onUpdateCall}
              updatedRows={rowRef}
              setShowUpdateButton={setShowUpdateButton}
            />
          ) : (
            <Grid container spacing={16}>
              <Typography variant="h6">{translate("no_records")}</Typography>
            </Grid>
          )}
          <SimpleModel
            /* eslint-disable react/jsx-props-no-spreading */
            {...dialogObject}
            openModal={importPopupFlag}
            handleClose={handleModelClose}
            handleAction={onBulkUpdateCall}
          />
        </>
      )}
    </div>
  );
};

export default ViewCarrierRating;
