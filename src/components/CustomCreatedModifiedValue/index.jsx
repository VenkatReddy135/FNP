/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React, { memo } from "react";
import { useTranslate } from "react-admin";
import PropTypes from "prop-types";
import { Typography, Grid } from "@material-ui/core";
import useStyles from "../../assets/theme/common";
import formatDateValue from "../../utils/formatDateTime";

/**
 * Component for displaying view mode fields for created and modified date
 *
 * @param {*} props all the props required by ViewModeFields component
 * @returns {React.ReactElement} returns a React component for ViewModeFields
 */
const CustomCreatedModifiedValue = memo((props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const {
    createdBy,
    createdByValue,
    createdDate,
    createdDateValue,
    modifiedBy,
    modifiedByValue,
    modifiedDate,
    modifiedDateValue,
  } = props.createdModifiedObj;
  const createdArr = [
    {
      title: createdBy || translate("created_by"),
      value: createdByValue,
    },
    {
      title: createdDate || translate("created_date"),
      value: formatDateValue(createdDateValue),
    },
  ];
  const modifiedArr = [
    {
      title: modifiedBy || translate("modified_by"),
      value: modifiedByValue,
    },
    {
      title: modifiedDate || translate("modified_date"),
      value: formatDateValue(modifiedDateValue),
    },
  ];
  const createdModifiedArr = [createdArr, modifiedArr];
  return (
    <>
      {createdModifiedArr.map((values) => (
        <Grid key={`CustomCreatedModifiedValue-${values[0].title}`} className={classes.customMargin} container>
          {values.map((createdModified) => (
            <Grid key={createdModified.title} item xs>
              <Typography variant="caption">{createdModified.title}</Typography>
              <Typography variant="h6">{createdModified.value}</Typography>
            </Grid>
          ))}
        </Grid>
      ))}
    </>
  );
});

CustomCreatedModifiedValue.propTypes = {
  createdModifiedObj: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default CustomCreatedModifiedValue;
