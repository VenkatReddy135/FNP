/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslate, required, DateInput } from "react-admin";
import { Typography, Grid, IconButton } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import useStyles from "../../../../../../assets/theme/common";
import { getFormattedDate } from "../../../../../../utils/formatDateTime";
import BoundedCheckBoxDropdown from "../../../../../../components/BoundedCheckBoxDropdown";
import { useCustomQueryWithStore } from "../../../../../../utils/CustomHooks";
import CustomViewUI from "../../../../../../components/CustomViewUI/CustomViewUI";

const requiredValidate = [required()];

/**
 * Component to render the View/Edit Page UI for Tag Relation
 *
 * @param {object} props props for tag config
 * @returns {React.ReactElement} tag config view
 */
const GeoLaunchDate = (props) => {
  const { isEditable, formData = {} } = props;
  const classes = useStyles();
  const translate = useTranslate();

  const { geoDetailsData } = formData;

  const [createProductObj, updateProductObj] = useState({
    multiSelectType: [],
    geoArray: [],
  });

  const stringifiedArray = JSON.stringify(geoDetailsData);

  useEffect(() => {
    updateProductObj((prev) => {
      return { ...prev, multiSelectType: geoDetailsData };
    });
  }, [stringifiedArray]);

  /**
   * @function getMultiSelectType function called on onchange of Type
   * @param {event} event event
   * @param {string} deletedItem item to be deleted
   */
  const handleDeleteIcon = (event, deletedItem) => {
    const modifiedArray = createProductObj.multiSelectType.filter((i) => i !== deletedItem);
    updateProductObj({
      ...createProductObj,
      multiSelectType: [...modifiedArray],
    });
  };

  /**
   * @function getMultiSelectType function called on onchange of Type
   * @param {event} event event
   */
  const getMultiSelectType = (event) => {
    updateProductObj({
      ...createProductObj,
      multiSelectType: event.target.value,
    });
  };
  /**
   * @function handleGeoDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleGeoDataSuccess = (res) => {
    const { data } = res?.data;
    const geoArray = data.map(({ tagId, tagName }) => {
      return { id: tagId, name: tagName };
    });
    updateProductObj((prev) => {
      return { ...prev, geoArray };
    });
  };
  const filter = [{ fieldName: "tagTypeId", operatorName: "Like", fieldValue: "G" }];
  const geoPayload = {
    size: 100,
    sortParam: "tagName:asc",
    filter: encodeURIComponent(JSON.stringify(filter)),
  };
  const geoResource = `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`;
  useCustomQueryWithStore("getData", geoResource, handleGeoDataSuccess, {
    payload: geoPayload,
  });

  return (
    <>
      <Grid container className={classes.listStyle}>
        <Grid item data-testid="geo_launch_date">
          <Typography variant="h4">{translate("geo_launch_date")}</Typography>
        </Grid>
      </Grid>
      <Grid item data-testid="geo_details" md={4}>
        <BoundedCheckBoxDropdown
          id="geo_details"
          data-testid="geoDetails"
          source="geoDetailsData"
          type="select"
          label={translate("category_geography")}
          className={`${classes.boundedDropdown} ${classes.newtagPickerDropdown}`}
          options={createProductObj.geoArray}
          onChange={getMultiSelectType}
          disabled={!isEditable}
          deletedItemArray={createProductObj.multiSelectType}
          deletable
        />
      </Grid>
      {createProductObj?.multiSelectType?.map((item) => (
        <Grid container key={item} className={classes.dividerStyle}>
          <Grid item data-testid="category_geography" md={4}>
            <CustomViewUI
              label={translate("category_geography")}
              value={item}
              className={classes.newtagPickerDropdown}
              gridSize={{ xs: 12, sm: 12, md: 12 }}
            />
          </Grid>
          <Grid item data-testid="from_date" md={4}>
            {!isEditable ? (
              <CustomViewUI
                label={translate("from_date")}
                value={formData[item]?.fromDate && getFormattedDate(formData[item]?.fromDate)}
                gridSize={{ xs: 12, sm: 12, md: 12 }}
              />
            ) : (
              <DateInput
                name={`${item}.fromDate`}
                source={`${item}.fromDate`}
                validate={requiredValidate}
                label={translate("from_date")}
                className={classes.newtagPickerDropdown}
                data-testid="fromDate"
              />
            )}
          </Grid>
          <Grid item md={4}>
            <Grid container data-testid="thru_date">
              {!isEditable ? (
                <CustomViewUI
                  label={translate("to_date")}
                  value={formData[item]?.thruDate && getFormattedDate(formData[item]?.fromDate)}
                  gridSize={{ xs: 12, sm: 12, md: 12 }}
                />
              ) : (
                <DateInput
                  name={`${item}.thruDate`}
                  source={`${item}.thruDate`}
                  validate={requiredValidate}
                  label={translate("to_date")}
                  className={classes.newtagPickerDropdown}
                  data-testid="toDate"
                />
              )}
              {isEditable && (
                <Grid data-testid="deleteicon">
                  <IconButton>
                    <DeleteOutlinedIcon onClick={(e) => handleDeleteIcon(e, item)} />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

GeoLaunchDate.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(GeoLaunchDate);
