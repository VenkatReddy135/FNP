/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import {
  Grid,
  Switch,
  Typography,
  Box,
  DialogContent,
  DialogContentText,
  IconButton,
  Chip,
  Divider,
} from "@material-ui/core";
import { Button, useTranslate } from "react-admin";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import orderBy from "lodash/orderBy";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import PropTypes from "prop-types";
import useStyles from "../Filter/FilterStyle";
import SimpleModel from "../../../components/CreateModal";
import useCommonStyles from "../../../assets/theme/common";

/**
 * Component to render the Edit Page of PLP filter
 *
 * @param {object} props contains data related to Edit Filter from
 * @returns {React.ReactElement} returns the Edit Page of PLP filter
 */
const FilterDetails = (props) => {
  const { resetFilter, saveFilter, attributes, hasOverride, isOverride, disabledReset, page } = props;
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const translate = useTranslate();
  const [modelData, setModelData] = useState({ open: false, content: "", type: "" });
  const { open, content, type } = modelData;
  const [localAttribute, setLocalAttribute] = useState(attributes);
  const [sortStatus, setSortStatus] = useState("DESC");
  const [searchValue, setSearchValue] = useState("");

  /**
   * @function handleClearSearch to clear the search input value
   */
  const handleClearSearch = () => {
    setSearchValue("");
  };

  /**
   * @function handleSearchChange to change the search input value
   *
   * @param {object } e event details for the input
   */
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  /**
   * @function dialogContent
   * @param {string } message name of the action
   * @returns {React.createElement} returning ui for save and reset filter page
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   * Function to handle reset confirmation modal Open
   *
   * @name handleResetConfirmModel
   */
  const handleResetConfirmModel = () => {
    setModelData({ open: true, content: translate("plp_global_filter.reset_config_msg"), type: "reset" });
  };

  /**
   * Function to handle Reset confirmation modal Open
   *
   * @name handleSaveConfirmModel
   */
  const handleSaveConfirmModel = () => {
    setModelData({
      open: true,
      content:
        page === "category"
          ? translate("plp_global_filter.save_config_msg")
          : translate("plp_global_filter.save_filter"),
      type: "save",
    });
  };

  /**
   * Function to handle confirmation modal close
   *
   * @name handleCloseConfirmModel
   */
  const handleCloseConfirmModel = () => {
    setModelData({ open: false, content: "", type: "" });
  };

  /**
   * Function to reset the configurations
   *
   * @name handleConfirm
   */
  const handleConfirm = () => {
    if (type === "reset") {
      resetFilter(false, "reset");
    } else {
      saveFilter(localAttribute);
    }
    setModelData({ open: false, content: "", type: "" });
  };

  /**
   * To update image/voice search toggle value
   *
   * @name handleStatusChange
   * @param {string} event to save changed value
   */
  const handleStatusChange = (event) => {
    const { checked, name } = event.target;
    const elementsIndex = localAttribute.findIndex((element) => element.attributesName === name);
    const attributeData = [...localAttribute];
    attributeData[elementsIndex] = { ...attributeData[elementsIndex], isEnabled: checked };
    const enableData = attributeData.filter(({ isEnabled }) => isEnabled);
    const disableData = attributeData.filter(({ isEnabled }) => !isEnabled);
    let updatedAttribute = [];
    if (sortStatus === "DESC") {
      updatedAttribute = [...enableData, ...disableData];
    } else {
      updatedAttribute = [...disableData, ...enableData];
    }
    const sorting = updatedAttribute.map((attribute, index) => ({
      ...attribute,
      sequenceNumber: index + 1,
    }));
    setLocalAttribute(sorting);
  };

  /**
   * To sort value of status in ASC/DEC order
   *
   * @name handleSort
   */
  const handleSort = () => {
    setSortStatus(sortStatus === "DESC" ? "ASC" : "DESC");
    const sortData =
      sortStatus === "DESC"
        ? orderBy(localAttribute, ["isEnabled", "sequenceNumber", "attributesName"], ["asc"])
        : orderBy(localAttribute, ["isEnabled", "sequenceNumber", "attributesName"], ["desc"]);
    setLocalAttribute(sortData);
  };

  /**
   * Function to reorder row on arrow click
   *
   * @param {number} index contains attribute name
   * @param {string} reorderType contains type to reorder row
   */
  const reorderAttribute = (index, reorderType) => {
    const attributeData = [...localAttribute];
    const swappingIndex = reorderType === "up" ? index - 1 : index + 1;
    const tempAttribute = attributeData[index];
    attributeData[index] = attributeData[swappingIndex];
    attributeData[swappingIndex] = tempAttribute;
    setLocalAttribute(attributeData);
  };

  const filterHeadingData = [
    translate("plp_global_filter.sequence"),
    translate("plp_global_filter.filter_name"),
    translate("status"),
  ];
  const activeAttributes = localAttribute.filter(({ isEnabled }) => isEnabled);
  const firstActive = activeAttributes.length && activeAttributes[0].attributesName;
  const lastActive = activeAttributes.length && activeAttributes[activeAttributes.length - 1].attributesName;
  const sortIcon = sortStatus === "DESC" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
  const detailsHeading = useMemo(
    () => (
      <Grid container className={classes.filterConfigHeading}>
        {filterHeadingData.map((key) => {
          return (
            <Grid item xs={2} key={key}>
              <Typography variant="h6" className={classes.filterConfigHeadingRow}>
                {key}
                {key === translate("status") && (
                  <IconButton onClick={handleSort} className={classes.sortIcon}>
                    {sortIcon}
                  </IconButton>
                )}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    ),
    [sortIcon],
  );

  const filterButton = useMemo(
    () => (
      <>
        <Button
          disabled={disabledReset}
          variant="outlined"
          label={translate("reset_button")}
          onClick={handleResetConfirmModel}
        />
        <Button variant="contained" label={translate("save")} onClick={handleSaveConfirmModel} />
      </>
    ),
    [],
  );

  return (
    <>
      <Grid container>
        <Grid item xs={5}>
          {((isOverride && hasOverride) || !hasOverride) && (
            <TextField
              placeholder={translate("plp_global_filter.search_filter")}
              label=""
              margin="normal"
              value={searchValue}
              onChange={handleSearchChange}
              className={`${commonClasses.formInputWidth} ${commonClasses.dividerStyle}`}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" color="disabled" mr={2} disabled />,
                endAdornment: (
                  <>
                    {searchValue && (
                      <IconButton onClick={handleClearSearch}>
                        <ClearIcon fontSize="small" color="disabled" mr={2} />
                      </IconButton>
                    )}
                  </>
                ),
              }}
            />
          )}
        </Grid>
      </Grid>
      <Divider variant="fullWidth" />
      {detailsHeading}
      <Grid className={!isOverride && hasOverride ? classes.overrideDisable : ""}>
        {localAttribute
          .filter((element) => element.attributesName.toLowerCase().includes(searchValue.toLowerCase()))
          .map(({ attributesName, isEnabled, isNew }, index) => (
            <Grid className={classes.filterConfigRow} key={attributesName}>
              <Grid item xs={2}>
                {isEnabled && !searchValue && (
                  <>
                    <ExpandLessIcon
                      onClick={() => firstActive !== attributesName && reorderAttribute(index, "up")}
                      className={firstActive === attributesName ? classes.inActiveIcon : ""}
                    />
                    <ExpandMoreIcon
                      onClick={() => lastActive !== attributesName && reorderAttribute(index, "down")}
                      className={lastActive === attributesName ? classes.inActiveIcon : ""}
                    />
                  </>
                )}
              </Grid>
              <Grid item xs={2}>
                {isNew && (
                  <Chip
                    label={translate("new")}
                    className={classes.chipIconFilter}
                    classes={{ label: classes.chipIconLabel }}
                  />
                )}
                {attributesName}
              </Grid>
              <Grid item xs={2}>
                <Switch checked={isEnabled} onChange={handleStatusChange} color="default" name={attributesName} />
              </Grid>
            </Grid>
          ))}
      </Grid>
      <Box mx="auto" width="50%" mt={2}>
        {((isOverride && hasOverride) || !hasOverride) && filterButton}
        <SimpleModel
          dialogContent={dialogContent(content)}
          showButtons
          closeText={translate("no")}
          actionText={translate("yes")}
          openModal={open}
          handleClose={handleCloseConfirmModel}
          handleAction={handleConfirm}
        />
      </Box>
    </>
  );
};

FilterDetails.propTypes = {
  hasOverride: PropTypes.bool.isRequired,
  isOverride: PropTypes.bool.isRequired,
  resetFilter: PropTypes.func.isRequired,
  saveFilter: PropTypes.func.isRequired,
  attributes: PropTypes.PropTypes.arrayOf(
    PropTypes.shape({
      attributesName: PropTypes.string.isRequired,
      isEnabled: PropTypes.bool.isRequired,
      sequenceNumber: PropTypes.number.isRequired,
    }),
  ).isRequired,
  disabledReset: PropTypes.bool,
  page: PropTypes.string,
};

FilterDetails.defaultProps = {
  disabledReset: false,
  page: "",
};

export default FilterDetails;
