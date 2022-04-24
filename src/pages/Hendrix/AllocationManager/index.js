import React, { useState } from "react";
import { Divider, Grid, Typography } from "@material-ui/core";
import {
  useTranslate,
  useDataProvider,
  SimpleForm,
  required,
  TextInput,
  SaveButton,
  useNotify,
  minValue,
  maxValue,
} from "react-admin";
import useStyles from "../styles";
import Dropdown from "../../../components/Dropdown";
import PageHeader from "../../../components/PageHeader";
import AddToList from "./AddtoList";
import AllocationTable from "./AllocationTable";
import { useCountryList } from "../hooks";
import { TIMEOUT } from "../../../config/GlobalConfig";
import { validateTime } from "../common";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/auto-rejection-policies`;

/**
 * Component for AllocationManager
 *
 * @returns {React.ReactElement} returns a AllocationManager component with datagrid
 */
const AllocationManager = () => {
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const notify = useNotify();
  const geography = useCountryList();
  const [vendorList, setVendorList] = useState({});
  const [rows, setRows] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [payLoad, setPayload] = useState({});
  const [fcType, setFcType] = useState("VENDOR_ID");
  const [geoId, setGeoid] = useState({});
  const [inputValues, setInputValues] = useState({
    distanceFromBaseGeoId: "",
    sameDayDuration: "",
    nextDayDuration: "",
    futureDuration: "",
    fromTime: "",
    thruTime: "",
  });
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [deleteAll, setDeleteAll] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  /**
   * @function fetchData To Fetch data based on geography
   * @param {object} payload object for api call
   * @returns {object} containing response data.
   */
  const fetchData = async (payload) => {
    const response = await dataProvider.getData(resource, payload);
    return response;
  };

  /**
   * @function createRows To construct array of objects using response for datagrid
   * @param {Array} rowData api respone
   * @returns {Array} rows
   */
  const createRows = (rowData) => {
    if (!rowData) return [];
    const rowList = [];
    rowData?.exceptionalFcs
      .map((val) => {
        return { ...Object.entries(val) };
      })
      .map((vendor) => rowList.push({ id: vendor[0][0], "FC ID": vendor[0][0], "FC Name": vendor[0][1] }));
    return rowList;
  };

  /**
   * @function onUpdateClick to make api call for updating the fc values
   */
  const onUpdateClick = async () => {
    let vendorIds = rows.map((list) => {
      if (fcType === "VENDOR_ID") return list["FC ID"];
      return list["FC Name"];
    });
    setShow(false);
    if (filteredVendors.length > 0) vendorIds = filteredVendors;
    const payload = {
      ...inputValues,
      geoId: vendorList.geoId != null ? vendorList.geoId : geoId,
      exceptionalFcs: vendorIds,
      columnOption: fcType,
    };
    const resp = await dataProvider.put(resource, { id: "", data: payload });
    if (resp.status === "success") {
      const { data, status } = await fetchData(payLoad);
      if (status === "success") {
        setShow(true);
        notify(translate("am_toast_success"), "info", TIMEOUT);
        setRows(() => [...createRows(data)]);
        setSelectedVendors("");
        setFcType("VENDOR_ID");
        setFilteredVendors([]);
        setDeleteAll(false);
        setShowUpdateButton(false);
      }
    } else {
      notify(translate(resp.data.errors[0]?.message), "error", TIMEOUT);
    }
  };

  /**
   * @function onAddToList to notify the table update
   */
  const onAddToList = () => {
    setShowUpdateButton(true);
    notify(translate("add_list"), "info", TIMEOUT);
  };

  /**
   * @function handleChange to make api call on selecting the domain
   * @param {object} e event
   * @returns {null | object} null/Error
   */
  const onDomainChange = async (e) => {
    const payload = {
      geoId: e.target.value,
    };
    setGeoid(e.target.value);
    setPayload(payload);
    try {
      const resp = await fetchData(payload);
      const { data, status } = resp;
      if (status === "success") {
        setVendorList(data);
        setRows(createRows(data));
        setInputValues((prev) => {
          return {
            ...prev,
            distanceFromBaseGeoId: data.distanceFromBaseGeoId,
            sameDayDuration: data.sameDayDuration,
            nextDayDuration: data.nextDayDuration,
            futureDuration: data.futureDuration,
            fromTime: data.fromTime,
            thruTime: data.thruTime,
          };
        });
        setShow(true);
      }
    } catch (err) {
      return err.response ? err.response.data : null;
    }
    return null;
  };

  /**
   * @function handleInputChange to update state values based on input change
   * @param {object} e event
   * @param {string} name property name
   */
  const handleInputChange = (e, name) => {
    const { value } = e.target;
    setInputValues((prev) => {
      return { ...prev, [name]: value };
    });
    setShowUpdateButton(true);
  };

  return (
    <>
      <PageHeader
        header={{
          ruleName: translate(`am_rule_name`),
        }}
        pathName={translate(`am_path_name`)}
        pathEndName={translate(`am_path_end_name`)}
        buttonName={translate(`am_update_button`)}
      />
      <SimpleForm submitOnEnter={false} toolbar={false}>
        <Dropdown
          label={translate("geography")}
          data={geography}
          onSelect={onDomainChange}
          edit
          validate={[required()]}
        />
      </SimpleForm>
      <Divider variant="fullWidth" />
      {show && (
        <>
          <SimpleForm
            save={onUpdateClick}
            submitOnEnter={false}
            toolbar={
              (showUpdateButton || filteredVendors.length > 0 || deleteAll) && (
                <SaveButton icon={<></>} className={classes.updateBtn} label={translate(`am_update_button`)} />
              )
            }
          >
            <Typography variant="h6">{translate(`am_distance_from_pincode`)}</Typography>
            <Grid>
              <TextInput
                label={translate(`am_distance`)}
                source="distance"
                autoComplete="off"
                initialValue={inputValues.distanceFromBaseGeoId}
                validate={[required("Please provide a numeric value above 0")]}
                onChange={(e) => handleInputChange(e, "distanceFromBaseGeoId")}
              />
            </Grid>
            <Grid>
              <Typography variant="h6">{translate(`am_timeBeforeRejection`)}</Typography>
              <TextInput
                label={translate(`am_same_day`)}
                source="sameday"
                autoComplete="off"
                className={classes.textFields}
                initialValue={inputValues.sameDayDuration}
                onChange={(e) => handleInputChange(e, "sameDayDuration")}
                validate={[required("Please provide a numeric value between 0 to 12"), minValue(0), maxValue(12)]}
              />
              <TextInput
                label={translate(`am_next_day`)}
                source="nextday"
                autoComplete="off"
                className={classes.textFields}
                initialValue={inputValues.nextDayDuration}
                onChange={(e) => handleInputChange(e, "nextDayDuration")}
                validate={[required("Please provide a numeric value between 0 to 24"), minValue(0), maxValue(24)]}
              />
              <TextInput
                label={translate(`am_future`)}
                source="futureday"
                autoComplete="off"
                initialValue={inputValues.futureDuration}
                onChange={(e) => handleInputChange(e, "futureDuration")}
                validate={[required("Please provide a numeric value above 0"), minValue(1)]}
              />
            </Grid>
            <Grid>
              <Typography variant="h6">{translate(`am_autoRejection`)}</Typography>
              <TextInput
                label={translate(`am_from_time`)}
                source="fromtime"
                autoComplete="off"
                className={classes.textFields}
                initialValue={inputValues.fromTime}
                onChange={(e) => handleInputChange(e, "fromTime")}
                validate={[required(), validateTime]}
              />
              <TextInput
                label={translate(`am_to_time`)}
                source="totime"
                autoComplete="off"
                initialValue={inputValues.thruTime}
                onChange={(e) => handleInputChange(e, "thruTime")}
                validate={[required(), validateTime]}
              />
            </Grid>
            <AddToList
              onAddToList={onAddToList}
              selectedVendors={selectedVendors}
              setSelectedVendors={setSelectedVendors}
              fcType={fcType}
              setFcType={setFcType}
              rows={rows}
              setRows={setRows}
            />
            <AllocationTable
              rows={rows}
              setRows={setRows}
              setDeleteAll={setDeleteAll}
              setFilteredVendors={setFilteredVendors}
              setShowUpdateButton={setShowUpdateButton}
            />
          </SimpleForm>
        </>
      )}
    </>
  );
};

export default AllocationManager;
