/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Grid, FormControl, Box } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import PropTypes from "prop-types";
import useStyles from "../../assets/theme/common";
import { generateUniqueId } from "../../utils/helperFunctions";

/**
 * DynamicFieldsList
 *
 * @param {object} props component props
 * @returns {React.Component} //return component
 */
const DynamicFieldsList = (props) => {
  const classes = useStyles();

  const { onSubmit, lastItem, fieldList } = props;

  return (
    <Grid container justify="space-between" direction="row">
      {fieldList.map((val, index) => (
        <Grid item xs key={generateUniqueId(`DynamicList-${index}`)}>
          <Box display="flex" justifyContent="center">
            {val}
          </Box>
        </Grid>
      ))}
      <Grid item xs key={generateUniqueId("DynamicList-controller")}>
        <FormControl className={classes.formControl}>
          <Box display="flex" justifyContent="center">
            {lastItem ? (
              <AddBoxIcon
                fontSize="large"
                onClick={onSubmit}
                className={`${classes.categoryMarginTop} ${classes.iconCursorPointer}`}
              />
            ) : (
              <DeleteOutlineIcon
                fontSize="large"
                onClick={onSubmit}
                className={`${classes.categoryMarginTop} ${classes.iconCursorPointer}`}
              />
            )}
          </Box>
        </FormControl>
      </Grid>
    </Grid>
  );
};

DynamicFieldsList.propTypes = {
  onSubmit: PropTypes.func,
  lastItem: PropTypes.bool,
  fieldList: PropTypes.arrayOf(PropTypes.element),
};
DynamicFieldsList.defaultProps = {
  onSubmit: () => {},
  lastItem: false,
  fieldList: [],
};

export default React.memo(DynamicFieldsList);
