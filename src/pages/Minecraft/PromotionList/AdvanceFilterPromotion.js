/* eslint-disable react/jsx-props-no-spreading */
import { Divider, Grid, Typography } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import {
  Button,
  SaveButton,
  SimpleForm,
  Toolbar,
  useNotify,
  useQueryWithStore,
  useRedirect,
  useTranslate,
} from "react-admin";
import BoundedCheckBoxDropdown from "../../../components/BoundedCheckBoxDropdown";
import DateTimeInput from "../../../components/CustomDateTimeV2";
import DropDownText from "../../../components/Dropdown";
import CustomTextInput from "../../../components/TextInput";
import { TIMEOUT } from "../../../config/GlobalConfig";
import promotionalConfig from "../../../config/PromotionConfig";
import { useCustomQueryWithStore, onFailure, onSuccess } from "../../../utils/CustomHooks";
import useRenderInput from "../PromotionHelper/useRenderInput";
import useStyles from "../style";

/**
 * @function AdvanceFilterPromotion Advanced search tool to filter the promotion list
 * @returns {React.Component} return react component
 */
const AdvanceFilterPromotion = () => {
  const classes = useStyles();

  const notify = useNotify();
  const translate = useTranslate();
  const redirect = useRedirect();

  const [filter, setFilter] = useState({});
  const [geoOptions, setGeoOptions] = useState([]);
  const [domainOptions, setDomainOptions] = useState([]);
  const [promotionalTypes, setPromotionalTypes] = useState([]);

  const [renderFromDateInput, fromDateRemount] = useRenderInput();
  const [renderThruDateInput, thruDateRemount] = useRenderInput();

  const title = translate("promotion_title");

  const listingUrl = `/${window.REACT_APP_MINECRAFT_SERVICE}/promotions`;
  const resourceForPromotionTypes = `${window.REACT_APP_MINECRAFT_SERVICE}/promotionTypes`;

  /**
   * @function handleGeoListSuccess update the value geo options
   * @param {object} res has result containing geo Values
   */
  const handleGeoListSuccess = (res) => {
    if (res?.data?.data) {
      setGeoOptions(res.data.data.map((item) => ({ id: item.countryId, name: item.countryName })));
    }
  };

  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_TIFFANY_SERVICE}/countries`,
      payload: {},
    },
    {
      onSuccess: (response) => {
        onSuccess({ response, notify, translate, handleSuccess: handleGeoListSuccess });
      },
      onFailure: (error) => {
        onFailure({ error, notify, translate });
      },
    },
  );

  /**
   * @function handleDomainListSuccess update the value domain options
   * @param {object} res has result containing domain Values
   */
  const handleDomainListSuccess = (res) => {
    if (res?.data?.data) {
      setDomainOptions(res.data.data.map((item) => ({ id: item.domainId, name: item.domainId })));
    }
  };

  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/primary-domain-geo`,
      payload: {},
    },
    {
      onSuccess: (response) => {
        onSuccess({ response, notify, translate, handleSuccess: handleDomainListSuccess });
      },
      onFailure: (error) => {
        onFailure({ error, notify, translate });
      },
    },
  );

  useCustomQueryWithStore("getData", resourceForPromotionTypes, (res) => {
    setPromotionalTypes([...res?.data?.data?.map((item) => ({ id: item.displayName, name: item.displayName }))]);
  });

  /**
   * @function handleChange set all the filter values
   */
  const handleChange = useCallback(
    ({ fieldName, value }) => {
      setFilter({ ...filter, [fieldName]: value });
    },
    [filter],
  );

  /**
   * @function getModifiedValues function to modify filter values
   * @param {string} key field name
   * @param {Array|string} value value of field
   * @returns {Array|string} modified value
   */
  const getModifiedValues = (key, value) => {
    if (promotionalConfig.advanceSearchSingleValueFields.includes(key)) {
      return value;
    }

    return Array.isArray(value) ? value : value?.trim().split(",");
  };

  /**
   * @function searchUrlRedirectHandler adds the field for filter and redirect to promotion list
   */
  const searchUrlRedirectHandler = () => {
    const filterArray = Object.entries(filter).map(([key, value]) => ({
      fieldName: key,
      fieldValue: getModifiedValues(key, value),
      operatorName: promotionalConfig.advanceSearchSingleValueFields.includes(key)
        ? promotionalConfig.operators.EQUAL_TO
        : promotionalConfig.operators.IN,
    }));

    const temp = { filter: btoa(JSON.stringify(filterArray)) };

    if (filterArray.length) {
      redirect(`${listingUrl}?filter=${JSON.stringify(temp)}&showFilter=yes`);
    } else {
      notify(translate("pleaseAddAtleastOneField"), "error", TIMEOUT);
    }
  };

  /**
   * @function cancelhandler to redirect back to listing page
   */
  const cancelHandler = () => {
    redirect(listingUrl);
  };

  /**
   *@function CustomToolbar component to show cancel and save buttons
   * @param {object} props all the props required custom toolbar
   * @returns {React.ReactElement} returns a React component
   */
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <Button type="button" label={translate("cancel")} variant="outlined" onClick={cancelHandler} />
      <SaveButton label={translate("apply")} icon={<></>} />
    </Toolbar>
  );

  /**
   *@function renderCustomTextInput component to show input fields
   * @param {string} fieldName required to define field
   * @param {string} label required to assign label to a input field
   * @returns {React.ReactElement} returns a React component
   */
  const renderCustomTextInput = (fieldName, label) => {
    return (
      <CustomTextInput
        source={fieldName}
        label={translate(label)}
        autoComplete="off"
        variant="standard"
        edit
        onChange={(e) => {
          handleChange({ fieldName, value: e.target.value });
        }}
      />
    );
  };

  /**
   * @function handleFromDateChange handle changes requried for from date update.
   * @param {object} e event.
   */
  const handleFromDateChange = (e) => {
    if (!filter.fromDate) fromDateRemount();
    handleChange({ fieldName: "fromDate", value: `${e.target.value}Z` });
  };

  /**
   * @function handleThruDateChange handle changes requried for from date update.
   * @param {object} e event.
   */
  const handleThruDateChange = (e) => {
    if (!filter.thruDate) thruDateRemount();
    handleChange({ fieldName: "thruDate", value: `${e.target.value}Z` });
  };

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={1}
        justify="space-between"
        className={classes.gridStyle}
        data-testid="advanceFilterPromotion"
      >
        <Grid item>
          <Typography variant="h5" className={classes.gridStyle}>
            {title}
          </Typography>
          <Divider variant="fullWidth" className={classes.dividerStyle} />
        </Grid>
      </Grid>
      <SimpleForm save={searchUrlRedirectHandler} toolbar={<CustomToolbar />}>
        <Grid item container direction="row" alignItems="flex-start" justify="flex-start" md={9}>
          <Grid item md={3} className={classes.maxWidthWrap}>
            <BoundedCheckBoxDropdown
              source="domainId"
              type="select"
              label={translate("promotion_domain")}
              variant="standard"
              edit
              selectAll
              options={domainOptions}
              onChange={(e) => {
                handleChange({ fieldName: "domainId", value: e.target.value });
              }}
            />
          </Grid>

          <Grid item md={3} className={classes.maxWidthWrap}>
            <BoundedCheckBoxDropdown
              source="geoId"
              type="select"
              label={translate("promotion_geo")}
              variant="standard"
              selectAll
              edit
              options={geoOptions}
              onChange={(e) => {
                handleChange({ fieldName: "geoId", value: e.target.value });
              }}
              className={classes.geo}
            />
          </Grid>

          <Grid item md={3} className={classes.maxWidthWrap}>
            {renderCustomTextInput("promotionName", "promotion_name")}
          </Grid>
        </Grid>
        <Grid item container direction="row" alignItems="flex-start" justify="flex-start" md={9}>
          <Grid item md={3} className={classes.maxWidthWrap}>
            {renderCustomTextInput("couponCode", "coupon_code")}
          </Grid>
          <Grid container md={3} className={classes.maxWidthWrap}>
            {renderFromDateInput && (
              <DateTimeInput
                source="fromDate"
                label={translate("promotion_start_date")}
                onChange={(e) => handleFromDateChange(e)}
              />
            )}
          </Grid>
          <Grid container md={3} className={classes.maxWidthWrap}>
            {renderThruDateInput && (
              <DateTimeInput
                source="thruDate"
                label={translate("promotion_end_date")}
                onChange={(e) => handleThruDateChange(e)}
              />
            )}
          </Grid>
        </Grid>
        <Grid item container direction="row" alignItems="flex-start" justify="flex-start" md={9}>
          <Grid item md={3} className={classes.maxWidthWrap}>
            {renderCustomTextInput("productName", "product_name")}
          </Grid>
          <Grid item md={3} className={classes.maxWidthWrap}>
            {renderCustomTextInput("categoryName", "category_name")}
          </Grid>
          <Grid item md={3} className={classes.maxWidthWrap}>
            <DropDownText
              source="state"
              label={translate("state")}
              variant="standard"
              edit
              data={[
                { id: "active", name: "Active" },
                { id: "inactive", name: "Inactive" },
              ]}
              onSelect={(e) => {
                handleChange({ fieldName: "status", value: e.target.value });
              }}
            />
          </Grid>
        </Grid>
        <Grid item container direction="row" alignItems="flex-start" justify="flex-start" md={9}>
          <Grid item md={3} className={classes.maxWidthWrap}>
            <DropDownText
              source="promotionType"
              label={translate("promotion_type")}
              variant="standard"
              edit
              data={promotionalTypes}
              onSelect={(e) => handleChange({ fieldName: "promotionType", value: e.target.value })}
            />
          </Grid>
          <Grid item md={3} className={classes.maxWidthWrap}>
            {renderCustomTextInput("promotionId", "promotion_id")}
          </Grid>
        </Grid>
      </SimpleForm>
    </>
  );
};

export default AdvanceFilterPromotion;
