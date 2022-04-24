import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Divider, Grid, Box, Switch, DialogContent, DialogContentText, Checkbox } from "@material-ui/core";
import { useTranslate, useNotify, useMutation, Button, useRefresh } from "react-admin";
import orderBy from "lodash/orderBy";
import useStyles from "../../../assets/theme/common";
import LoaderComponent from "../../../components/LoaderComponent";
import { TIMEOUT, color } from "../../../config/GlobalConfig";
import SimpleModel from "../../../components/CreateModal";
import FilterDetails from "../FilterDetails";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../utils/CustomHooks";
import filterStyle from "../Filter/FilterStyle";
import FilterHeading from "./FilterHeading";

/**
 * Component to render the Category Filters Page of PLP filter
 *
 * @param {object} props all the props required by the Category Filters Page of PLP filter
 * @returns {React.ReactElement} returns the Category Filters Page of PLP filter
 */
const CategoryPLPFilter = (props) => {
  const { match } = props;
  const { id } = match.params;
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const [filterDetails, setFilterDetails] = useState({});
  const {
    categoryName,
    isEnabled,
    filterAttributes,
    inheritedFrom,
    isOverride,
    categoryUrl,
    updatedAt,
  } = filterDetails;
  const [mutate, { loading: mutateLoading }] = useMutation();
  const [isConfirmModal, setIsConfirmModal] = useState({ open: false, content: "", type: "" });
  const { open, content, type } = isConfirmModal;
  const [isOverrideLocal, setIsOverride] = useState(isOverride);
  const hasOverride = inheritedFrom !== null;
  const refresh = useRefresh();
  const { white } = color;
  const filterClasses = filterStyle();

  useEffect(() => {
    setIsOverride(isOverride);
  }, [isOverride]);

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    setFilterDetails(res.data);
  };

  const resource = `${window.REACT_APP_COLUMBUS_SERVICE}/categories/productfilterconfigs?categoryId=${id}`;
  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess, {
    payload: {
      extraHeaders: { "Accept-Language": "en" },
    },
  });

  /**
   * @function handleSave This function will handle Success
   * @param  {object} response value to update Data
   */
  const handleSave = (response) => {
    setFilterDetails((prevState) => ({
      ...prevState,
      filterAttributes: response.data?.filterAttributes,
      isOverride: response.data?.isOverride,
    }));
    notify(translate("plp_global_filter.filter_save_success"));
  };

  /**
   * Function To enable the selected filter
   *
   * @name handleFilterSave
   * @param {Array} attributeData updated Attribute Data
   */
  const handleFilterSave = (attributeData) => {
    const sortedAttribute = attributeData.map((attribute, index) => ({
      ...attribute,
      sequenceNumber: index + 1,
    }));
    mutate(
      {
        type: "update",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/productfilterconfigs/attributes/${id}?isOverride=${isOverrideLocal}`,
        payload: {
          data: sortedAttribute,
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleSave });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  /**
   * @function handleSave This function will handle Success
   * @param {object} response is passed to the function
   */
  const handleResetSuccess = (response) => {
    if (response.data.message) notify(response.data.message, "info", TIMEOUT);
    setIsOverride(false);
    refresh();
  };

  /**
   * Function To reset the selected filter
   *
   * @name handleFilterReset
   */
  const handleFilterReset = () => {
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/productfilterconfigs/reset/${id}`,
        payload: {},
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleResetSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
    setIsConfirmModal({ open: false, content: "", type: "" });
  };

  /**
   * Function To enable the selected filter
   *
   * @name handleSuccessActive
   * @param {object} response value to enable/disable
   *
   */
  const handleSuccessActive = (response) => {
    setFilterDetails((prevState) => ({ ...prevState, isEnabled: response.data?.isEnabled }));
    notify(
      isEnabled
        ? translate("plp_global_filter.filter_disable_success")
        : translate("plp_global_filter.filter_enable_success"),
      "info",
      TIMEOUT,
    );
  };

  /**
   * Function To enable the selected filter
   *
   * @name handleFilterStatusChange
   * @param {boolean} status value to enable/disable
   *
   */
  const handleFilterStatusChange = (status) => {
    mutate(
      {
        type: "update",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/productfilterconfigs/${id}`,
        payload: {
          data: {
            isEnabled: status,
          },
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleSuccessActive });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
    setIsConfirmModal({ open: false, content: "", type: "" });
  };

  /**
   * Function To enable the selected filter
   *
   * @name handleConfirmationYes
   * @param {boolean} status value to enable/disable
   * @param {string} action value of action
   */
  const handleConfirmationYes = (status, action) => {
    if (type === "override") {
      if (isOverrideLocal) {
        handleFilterReset();
      } else {
        setIsConfirmModal({ open: false, content: "", type: "" });
      }
      setIsOverride(!isOverrideLocal);
    } else {
      handleFilterStatusChange(status, action);
    }
  };

  /**
   * @function dialogContent function set confirmation message
   * @param {string } message name of the action
   * @returns {React.createElement} returns a message
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   *  @function showConfirmationModal to open the confirmation modal
   */
  const showConfirmationModal = () => {
    const message = isEnabled
      ? translate("plp_global_filter.filter_disable_message")
      : translate("plp_global_filter.filter_enable_message");
    setIsConfirmModal({ open: true, content: message, type: "enable" });
  };

  /**
   *  @function handleConfirmationClose to close the confirmation modal
   */
  const handleConfirmationClose = () => {
    setIsConfirmModal({ open: false, content: "", type: "" });
  };

  /**
   *  @function showOverrideModel to open the confirmation modal
   */
  const showOverrideModel = () => {
    setIsConfirmModal({
      open: true,
      content: isOverrideLocal
        ? translate("plp_global_filter.reset_config_msg")
        : translate("plp_global_filter.override_config_msg"),
      type: "override",
    });
  };

  const sortedAttributes =
    filterAttributes && orderBy(filterAttributes, ["isEnabled", "sequenceNumber", "attributesName"], ["desc"]);

  if (loading || mutateLoading) {
    return <LoaderComponent />;
  }
  return (
    <>
      <Box m={2}>
        {Object.keys(filterDetails).length !== 0 && (
          <Grid container>
            <FilterHeading
              id={id}
              categoryName={categoryName}
              categoryUrl={categoryUrl}
              hasOverride={hasOverride}
              isEnabled={isEnabled}
              isOverride={isOverride}
              inheritedFrom={inheritedFrom}
              updatedAt={updatedAt}
            />
            <Grid item xs={4}>
              <Switch checked={isEnabled} color="default" onChange={showConfirmationModal} name="isEnabled" />
            </Grid>
            {hasOverride && isEnabled && (
              <Grid item xs={4} className={classes.textAlignRight}>
                <Button
                  variant={isOverrideLocal ? "contained" : "outlined"}
                  label={translate("plp_global_filter.override")}
                  onClick={showOverrideModel}
                >
                  <Checkbox
                    checked={isOverrideLocal}
                    classes={{ colorSecondary: filterClasses.checkboxIcon }}
                    style={isOverrideLocal ? { color: white } : {}}
                  />
                </Button>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
      <Divider variant="fullWidth" />
      {isEnabled && (
        <FilterDetails
          resetFilter={handleFilterReset}
          saveFilter={handleFilterSave}
          attributes={sortedAttributes}
          hasOverride={hasOverride}
          isOverride={isOverrideLocal}
          disabledReset={!hasOverride}
          page="category"
        />
      )}
      <SimpleModel
        dialogContent={dialogContent(content)}
        openModal={open}
        handleClose={handleConfirmationClose}
        handleAction={() => handleConfirmationYes(!isEnabled, "activate")}
        dialogTitle=""
        showButtons
        closeText={translate("no")}
        actionText={translate("yes")}
      />
    </>
  );
};

CategoryPLPFilter.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default CategoryPLPFilter;
