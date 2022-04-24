import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, Divider, Grid, Box, Switch, DialogContent, DialogContentText, Checkbox } from "@material-ui/core";
import { useTranslate, useNotify, useMutation, useRedirect, Button } from "react-admin";
import orderBy from "lodash/orderBy";
import useStyles from "../../../../assets/theme/common";
import LoaderComponent from "../../../../components/LoaderComponent";
import { TIMEOUT, color } from "../../../../config/GlobalConfig";
import SimpleModel from "../../../../components/CreateModal";
import FilterDetails from "../../FilterDetails";
import formatDateValue from "../../../../utils/formatDateTime";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import filterStyle from "../FilterStyle";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component to render the Edit Page of PLP filter
 *
 * @param {object} props all the props required by the Edit Page of PLP filter
 * @returns {React.ReactElement} returns the Edit Page of PLP filter
 */
const EditPLPFilter = (props) => {
  const { match } = props;
  const { id } = match.params;
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const [filterDetails, setFilterDetails] = useState({});
  const { geoId, productTypeId, isEnabled, filterAttributes, updatedAt, inheritedFrom, isOverride } = filterDetails;
  const [mutate, { loading: mutateLoading }] = useMutation();
  const [isConfirmModal, setIsConfirmModal] = useState({ open: false, content: "", type: "" });
  const { open, content, type } = isConfirmModal;
  const [isOverrideLocal, setIsOverride] = useState(isOverride);
  const hasOverride = inheritedFrom && inheritedFrom !== null;
  const redirect = useRedirect();
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

  const resource = `${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs/${id}`;
  const { loading } = useCustomQueryWithStore("getOne", resource, handleSetDataSuccess);

  /**
   * @function handleSave This function will handle Success
   */
  const handleSave = () => {
    redirect(`/${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs`);
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
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs/attributes/${id}?isOverride=${isOverrideLocal}`,
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
   * Function To enable the selected filter
   *
   * @name handleSuccessActive
   * @param {object} res value to enable/disable
   *
   */
  const handleSuccessActive = (res) => {
    setFilterDetails((prevState) => ({ ...prevState, isEnabled: res.data?.isEnabled }));
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
   * @name handleSuccessReset
   * @param {object} res value to enable/disable
   *
   */
  const handleSuccessReset = (res) => {
    setFilterDetails((prevState) => ({ ...prevState, isEnabled: res.data?.isEnabled }));
    redirect(`/${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs`);
    notify(translate("plp_global_filter.filter_reset_success"), "info", TIMEOUT);
  };

  /**
   * Function To enable the selected filter
   *
   * @name handleFilterStatusChange
   * @param {boolean} status value to enable/disable
   * @param {string} action value to enable/disable/reset
   *
   */
  const handleFilterStatusChange = (status, action) => {
    mutate(
      {
        type: "update",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs/${id}`,
        payload: {
          data: {
            isEnabled: status,
          },
        },
      },
      {
        onSuccess: (response) => {
          if (action === "activate") {
            onSuccess({ response, notify, translate, handleSuccess: handleSuccessActive });
          } else {
            onSuccess({ response, notify, translate, handleSuccess: handleSuccessReset });
          }
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
   * @name handleFilterStatusChange
   * @param {boolean} status value to enable/disable
   * @param {boolean} action value of action
   */
  const handleConfirmationYes = (status, action) => {
    if (type === "override") {
      setIsOverride(!isOverrideLocal);
    } else {
      handleFilterStatusChange(status, action);
    }
    setIsConfirmModal({ open: false, content: "", type: "" });
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
    if (!isOverrideLocal) {
      setIsConfirmModal({
        open: true,
        content: translate("plp_global_filter.override_config_msg"),
        type: "override",
      });
    } else {
      setIsOverride(!isOverrideLocal);
    }
  };

  const sortedAttributes =
    filterAttributes && orderBy(filterAttributes, ["isEnabled", "sequenceNumber", "attributesName"], ["desc"]);
  const breadcrumbs = [
    {
      displayName: translate("plp_global_filter.main_title"),
      navigateTo: `/${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs`,
    },
    { displayName: `${geoId} / ${productTypeId}` },
  ];
  if (mutateLoading || loading) {
    return <LoaderComponent />;
  }
  return (
    <>
      {Object.keys(filterDetails).length !== 0 && (
        <>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <Typography variant="h5" className={classes.mainTitleHeading}>
            {`${geoId} / ${productTypeId}`}
          </Typography>
          <Divider variant="fullWidth" />
          <Box m={2}>
            <Grid container>
              <Grid item xs={4}>
                <Typography variant="h4">{`${geoId} / ${productTypeId}`}</Typography>
                {hasOverride && isEnabled && !isOverride && (
                  <>
                    <Typography variant="h6" className={classes.secondaryHeading}>
                      {`${translate("plp_global_filter.inherited_from")} ${inheritedFrom}`}
                    </Typography>
                    <Typography variant="h6" className={classes.secondaryText}>
                      {translate("plp_global_filter.use_override_config")}
                    </Typography>
                  </>
                )}
                {updatedAt && isEnabled && !hasOverride && (
                  <Typography variant="h6" className={classes.secondaryText}>
                    {`${translate("plp_global_filter.last_update")}: ${formatDateValue(updatedAt)}`}
                  </Typography>
                )}
                {isOverride && (
                  <>
                    <Typography variant="h6" className={classes.secondaryHeading}>
                      {translate("plp_global_filter.overridden_config_msg")}
                    </Typography>
                    <Typography variant="h6" className={classes.secondaryText}>
                      {formatDateValue(updatedAt)}
                    </Typography>
                  </>
                )}
              </Grid>
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
          </Box>
        </>
      )}
      <Divider variant="fullWidth" />
      {isEnabled && (
        <FilterDetails
          resetFilter={handleFilterStatusChange}
          saveFilter={handleFilterSave}
          attributes={sortedAttributes}
          disabledReset
          hasOverride={hasOverride}
          isOverride={isOverrideLocal}
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

EditPLPFilter.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EditPLPFilter;
