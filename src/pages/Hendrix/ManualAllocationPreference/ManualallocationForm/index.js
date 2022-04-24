import React, { useState, useEffect } from "react";
import { useTranslate, useDataProvider, required, SaveButton, SimpleForm } from "react-admin";
import { useHistory, useLocation } from "react-router-dom";
import { Divider, Grid } from "@material-ui/core";
import useStyles from "../../styles";
import DropdownGroups from "../../../../components/DropdownGroup";
import Dropdown from "../../../../components/Dropdown";
import PageHeader from "../../../../components/PageHeader";
import Layout from "./Layout";
import Modal from "../../../../components/CreateModal";
import { useGeoGroups, useDeliveryMode, useProductGroup, useCountryList, useVendorList } from "../../hooks";
import SearchComponent from "../../../../components/SearchComponent";
import { vendorTypes, manualAllocationFieldNameArray } from "../../common";

const resourceFc = `${window.REACT_APP_HENDRIX_SERVICE}/manual-allocation-preferences/fcs`;
const resourceCarriers = `${window.REACT_APP_HENDRIX_SERVICE}/manual-allocation-preferences/carriers`;

/**
 * Component for Manual allocation Carrier
 *
 * @returns {React.ReactElement} returns a Manual allocation Carrier component with datagrid
 */
const ManualallocationList = () => {
  const classes = useStyles();
  const history = useHistory();
  const dataProvider = useDataProvider();
  const { search } = useLocation();
  let selectedData = "";
  if (search) {
    const query = new URLSearchParams(search);
    const paramData = (query.get("home") || "").split("|");
    selectedData = paramData ? JSON.parse(atob(paramData)) : "";
  }
  const geography = useCountryList();
  const [geoGroup, fetchGeoGroup] = useGeoGroups("");
  const [deliveryMode, fetchDeliveryModes] = useDeliveryMode("");
  const [vendorIDs, fetchVendorList] = useVendorList("");
  const pgGroup = useProductGroup("");
  const [ModalOpen, setModalOpen] = useState(false);
  const [dialogObject, setConfirmDialog] = useState("");
  const translate = useTranslate();
  const [apiData, setApiData] = useState([]);
  const [selectedInput, setSelectedInput] = useState({
    deliveryMode: "",
    geoId: "",
    geoGroupId: "",
    vendorType: "",
    pgId: "",
    vendorId: "",
  });
  const [searchInput, setSearchInput] = useState({
    fieldName: "",
    fieldValues: "",
    operator: "",
  });

  // static dropDown
  const dropDownListArray = [
    {
      id: 0,
      key: "geoId",
      placeholder: translate("mapCarrier_geography"),
      type: "Dropdown",
      Dataset: geography,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.geoId : "",
    },
    {
      id: 1,
      key: "vendorType",
      placeholder: translate("mapCarrier_fc_carrier"),
      type: "Dropdown",
      Dataset: vendorTypes,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.vendorType : "",
    },
    {
      id: 2,
      key: "geoGroupId",
      placeholder: translate("mapCarrier_geoGroup"),
      type: "Dropdown",
      Dataset: geoGroup,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.geoGroupId : "",
    },
    {
      id: 3,
      key: "deliveryMode",
      placeholder: translate("mapCarrier_deliveryMode"),
      type: "Dropdown",
      Dataset: deliveryMode,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.deliveryMode : "",
    },
    {
      id: 4,
      key: "pgId",
      placeholder: translate("mapCarrier_productGroup"),
      type: "Dropdown",
      Dataset: pgGroup,
      defaultValue: selectedData.inputVal !== undefined ? selectedData.inputVal.pgId : "",
    },
  ];

  useEffect(() => {
    if (selectedInput.geoId && selectedInput.geoGroupId && selectedInput.vendorType && selectedInput.deliveryMode) {
      fetchVendorList(selectedInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInput.geoId, selectedInput.geoGroupId, selectedInput.vendorType, selectedInput.deliveryMode]);

  // to store pagination details
  const pageData = React.useRef();

  /**
   * To Fetch data based on Payload change
   *
   * @param {string} key key
   * @param {object} obj payload object
   * @returns {object} response object
   */
  const fetchData = async (key, obj = {}) => {
    let payload = {};
    if (key === "defaultSearch") {
      payload = { ...selectedInput };
    } else if (key === "redirect") {
      payload = obj;
    } else if (key === "filterSearch") payload = { ...selectedInput, ...obj };
    else payload = { ...obj };
    const vendorApiKey = payload.vendorType === "FC" ? resourceFc : resourceCarriers;
    const {
      data: { data, totalPages, total, currentPage },
    } = await dataProvider.getData(vendorApiKey, payload);
    pageData.current = { totalPages, total, currentPage };
    return { data, totalPages, total, currentPage };
  };

  /**
   * @function To update the state value based on dropdown change
   *
   * @param {string} key property name
   * @param {object} e event object
   * @param {object} type contains field name
   */
  const onDropdownSelection = (key, e, type) => {
    const { value } = e.target;
    if (type === "Dropdown") {
      if (key === "geoId") {
        fetchGeoGroup(value);
      } else if (key === "vendorType") {
        fetchDeliveryModes(value);
      }
      setSelectedInput({ ...selectedInput, [key]: value });
    }
  };

  /**
   * To fetch the data based on selected values and populate on grid
   *
   * @returns {null | object} null
   */
  const onViewClick = async () => {
    setApiData([]);
    setSearchInput({
      fieldName: "",
      fieldValues: "",
      operator: "",
    });
    const key = "defaultSearch";
    try {
      const { data, totalPages, total, currentPage } = await fetchData(key);
      pageData.current = { totalPages, total, currentPage };
      setApiData(data);
    } catch (error) {
      return error.response ? error.response.data : null;
    }
    return null;
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
      dialogContent: title,
      showButtons,
      closeText,
      actionText,
    };
    setConfirmDialog(dialogObj);
    setModalOpen(true);
  };

  useEffect(() => {
    if (selectedData) {
      const { inputVal } = selectedData;
      /**
       * @function to {Array} handle Home Page redirect and update the state values
       *
       */
      const onRedirect = async () => {
        fetchDeliveryModes(inputVal.vendorType);
        fetchGeoGroup(inputVal.geoId);
        setSelectedInput((prev) => {
          return { ...prev, ...inputVal };
        });
        // const payload = { ...inputVal };
        const { data } = await fetchData("redirect", inputVal);
        setApiData(data);
        history.replace({ search: null });
      };
      onRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   *
   * @function to fetch the filtered data based on the selected fieldValues
   * @returns {*} Filtered rows for grid
   */
  const searchCall = async () => {
    try {
      const { data } = await fetchData("filterSearch", searchInput);
      setApiData(data);
    } catch (error) {
      return error.response ? error.response.data : null;
    }
    return null;
  };

  return (
    <>
      <PageHeader
        header={{
          ruleName: translate(`mapCarrier_ruleTitle`),
        }}
        buttonName={translate(`mapCarrier_updateButton`)}
        onBtnClick={onUpdateCall}
        enableButton={false}
      />
      <SimpleForm
        className={classes.pageSimpleForm}
        save={onViewClick}
        submitOnEnter={false}
        toolbar={<SaveButton className={classes.saveBtn} variant="outlined" icon={<></>} label="VIEW" />}
      >
        <Grid container item xs spacing={24}>
          {dropDownListArray.map((dropdownObj) => (
            <Grid item xs className={classes.dropdownContainer}>
              <DropdownGroups
                key={dropdownObj.key.toString()}
                label={dropdownObj.placeholder}
                dropdownObj={dropdownObj}
                onDropdownSelection={onDropdownSelection}
                validate={[required()]}
                edit
              />
            </Grid>
          ))}
          {selectedInput.vendorType === "CR" ? (
            <Dropdown
              className={classes.dropdown}
              value={selectedData.inputVal !== undefined ? selectedData.inputVal.vendorId : ""}
              label={translate("mapCarrier_selectFulfilmentCenter")}
              data={vendorIDs}
              validate={[required()]}
              onSelect={(e) => onDropdownSelection("vendorId", e, "Dropdown")}
              edit
            />
          ) : null}
        </Grid>
      </SimpleForm>

      <Divider variant="fullWidth" />
      {(apiData.length > 0 || searchInput.fieldValues || searchInput.fieldName || searchInput.operator) && (
        <>
          <SearchComponent
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            searchCall={searchCall}
            menuItem={manualAllocationFieldNameArray}
          />
          <Divider variant="fullWidth" />
          <Layout
            apiData={apiData}
            selectedInput={selectedInput}
            fetchData={fetchData}
            pageData={pageData}
            pgGroup={pgGroup}
            onUpdateCall={onUpdateCall}
            searchInput={searchInput}
          />
          <Modal
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...dialogObject}
            openModal={ModalOpen}
            handleClose={() => setModalOpen(false)}
            handleAction={() => setModalOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default ManualallocationList;
