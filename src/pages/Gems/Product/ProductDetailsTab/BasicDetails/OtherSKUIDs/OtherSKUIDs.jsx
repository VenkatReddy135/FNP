/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslate, TextInput } from "react-admin";
import { Typography, Grid } from "@material-ui/core";
import useStyles from "../../../../../../assets/theme/common";
import formatDateValue from "../../../../../../utils/formatDateTime";
import BoundedCheckBoxDropdown from "../../../../../../components/BoundedCheckBoxDropdown";
import CustomViewUI from "../../../../../../components/CustomViewUI/CustomViewUI";

/**
 * Component to render the View/Edit Page UI for Tag Relation
 *
 * @param {*} props props for tag config
 * @returns {React.ReactElement} tag config view
 */
const OtherSKUIDs = (props) => {
  const { formData = {}, isEditable, otherSKUTypesData = [], errorMsg } = props;
  const { otherSKUTypes, createdAt, createdBy, updatedAt, updatedBy } = formData;
  const classes = useStyles();
  const translate = useTranslate();

  const [createProductObj, updateProductObj] = useState({
    multiSelectType: [],
  });

  const stringifiedArray = JSON.stringify(otherSKUTypes);

  useEffect(() => {
    updateProductObj((prev) => {
      return { ...prev, multiSelectType: otherSKUTypes };
    });
  }, [stringifiedArray]);

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

  return (
    <>
      <Grid className={classes.listStyle}>
        <Typography data-testid="other_sku_ids" variant="h4">
          {translate("other_sku_ids")}
        </Typography>
      </Grid>

      <Grid item data-testid="other_sku_types" md={3}>
        <BoundedCheckBoxDropdown
          id="other_sku_types"
          data-testid="otherSKUTypes"
          source="otherSKUTypes"
          type="select"
          label={translate("other_sku_types")}
          className={`${classes.boundedDropdown} ${classes.newtagPickerDropdown}`}
          options={otherSKUTypesData}
          onChange={getMultiSelectType}
          disabled={!isEditable}
          deletable
        />
      </Grid>
      <Grid container>
        {createProductObj?.multiSelectType?.map((item) => (
          <Grid key={item} item md={4}>
            <TextInput
              source={item}
              label={translate(item)}
              data-testid={item}
              className={classes.newtagPickerDropdown}
              disabled={!isEditable}
              errorMsg={errorMsg}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container className={classes.listStyle}>
        <Grid item data-testid="relations_created_by" md={4}>
          <CustomViewUI label={translate("relations_created_by")} value={createdBy} />
        </Grid>
        <Grid item data-testid="relations_created_date" md={8}>
          <CustomViewUI
            label={translate("relations_created_date")}
            value={createdAt ? formatDateValue(createdAt) : null}
          />
        </Grid>
      </Grid>
      <Grid container className={classes.tabStyle}>
        <Grid item data-testid="last_modified_by" md={4}>
          <CustomViewUI label={translate("last_modified_by")} value={updatedBy} />
        </Grid>
        <Grid item data-testid="last_modified_date" md={8}>
          <CustomViewUI label={translate("last_modified_date")} value={updatedAt ? formatDateValue(updatedAt) : null} />
        </Grid>
      </Grid>
    </>
  );
};

OtherSKUIDs.propTypes = {
  isEditable: PropTypes.bool.isRequired,
  errorMsg: PropTypes.bool,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  otherSKUTypesData: PropTypes.arrayOf(PropTypes.any).isRequired,
};

OtherSKUIDs.defaultProps = {
  errorMsg: false,
};

export default React.memo(OtherSKUIDs);
