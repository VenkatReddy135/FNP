import React, { useState, useEffect } from "react";
import { useTranslate, useNotify, useMutation } from "react-admin";
import PropTypes from "prop-types";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSelector, useDispatch } from "react-redux";
import { Grid, Typography, TextField, Box, FormControl } from "@material-ui/core";
import { has } from "lodash";
import useStyle from "./lookBackWindowStyles";
import CallToAction from "../CallToAction";
import LoaderComponent from "../../../../components/LoaderComponent";
import { saveFormData } from "../../../../actions/columbus";
import { TIMEOUT } from "../../../../config/GlobalConfig";

/**
 * Look Back Window component adding Look Back Window configuration
 *
 *  @param {object} props contains data related to LookBackWindow from
 * @returns {React.ReactElement} Look Back Window from.
 */
const LookBackWindow = (props) => {
  const { domain } = props;
  const {
    apiFormData: { lookBackWindow, error },
  } = useSelector((state) => state.columbus);
  const { value } = lookBackWindow;
  const classes = useStyle();
  const translate = useTranslate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const notify = useNotify();
  const [mutate] = useMutation();
  const resource = `${window.REACT_APP_COLUMBUS_SERVICE}/configurations/configattributes`;
  const [apiError, setApiError] = useState(false);

  // We are not calling get API when we switch to tabs.
  // IF API gives any error react admin re-renders the component. to avoid this added condition
  useEffect(() => {
    setApiError(false);
  }, [domain]);

  // To validate value is less than 0
  const isInvalidValue = value < 0;
  /**
   * To get look Back Window fields by domain name
   *
   * @name getLookBackWindowFields
   */
  const getLookBackWindowFields = () => {
    mutate(
      {
        type: "getData",
        resource,
        payload: { domainId: domain, attributeName: "lookbackperiod" },
      },
      {
        enabled: domain.toLowerCase() !== "",
        onSuccess: (res) => {
          if (res.status === "success" && res.data) {
            const lookBackWindowObject = res.data;
            if (has(res.data, "value")) {
              lookBackWindowObject.value = Number.isInteger(Number(res.data?.value)) ? res.data?.value : 0;
            }
            dispatch(saveFormData({ lookBackWindow: lookBackWindowObject }));
            setLoading(false);
          } else {
            setLoading(false);
            setApiError(true);
            dispatch(saveFormData({ lookBackWindow: {} }));
            notify(
              res.message ? res.message : translate("indexable_attribute.configurations_get_error"),
              "error",
              TIMEOUT,
            );
          }
        },
        onFailure: (e) => {
          setLoading(false);
          setApiError(true);
          notify(e.message ? e.message : translate("indexable_attribute.configurations_get_error"), "error", TIMEOUT);
        },
      },
    );
  };

  useEffect(() => {
    if (!has(lookBackWindow, "value") && !loading && !apiError) {
      setLoading(true);
      getLookBackWindowFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookBackWindow]);

  /**
   * To update capping configuration for selected domain
   *
   * @name updateFieldsByDomainAPI
   */
  const updateFieldsByDomainAPI = () => {
    setLoading(true);
    mutate(
      {
        type: "put",
        resource,
        payload: {
          id: { attributeName: "lookbackperiod", domainId: domain.toLowerCase() },
          data: lookBackWindow,
        },
      },
      {
        onSuccess: (res) => {
          setLoading(false);
          if (res.status === "success" && res.data) {
            const lookBackWindowObject = {};
            const lookBackData = res.data || {};
            if (has(lookBackData, "value")) {
              lookBackWindowObject.value = Number.isInteger(Number(lookBackData.value)) ? lookBackData.value : 0;
            }
            dispatch(saveFormData({ lookBackWindow: lookBackWindowObject, error: "" }));
            notify(translate("indexable_attribute.update_success_message"), "info", TIMEOUT);
          } else {
            notify(res.message ? res.message : translate("indexable_attribute.update_fail_message"), "error", TIMEOUT);
          }
        },
        onFailure: (e) => {
          setLoading(false);
          notify(e.message ? e.message : translate("indexable_attribute.update_fail_message"), "error", TIMEOUT);
        },
      },
    );
  };

  /**
   * Function to maintain values changed
   *
   * @name onLookBackWindowChange
   * @param {object} e contains data of the input
   */
  const onLookBackWindowChange = (e) => {
    dispatch(saveFormData({ lookBackWindow: { ...lookBackWindow, value: e.target.value * 1 } }));
  };

  /**
   * Call back function for Reset configurations
   *
   * @name resetConfiguration
   *
   */
  const resetConfiguration = () => {
    setLoading(true);
    mutate(
      {
        type: "put",
        resource: `${resource}/reset`,
        payload: {
          id: { domainId: domain.toLowerCase(), attributeName: "lookbackperiod" },
          data: {},
        },
      },
      {
        onSuccess: (res) => {
          setLoading(false);
          if (res.status === "success" && res.data) {
            const lookBackWindowObject = {};
            const lookBackData = res.data || {};
            if (has(lookBackData, "value")) {
              lookBackWindowObject.value = Number.isInteger(Number(lookBackData.value)) ? lookBackData.value : 0;
            }
            dispatch(saveFormData({ lookBackWindow: lookBackWindowObject }));

            notify(translate("indexable_attribute.reset_success_message"), "info", TIMEOUT);
          } else {
            notify(res.message ? res.message : translate("indexable_attribute.update_fail_message"), "error", TIMEOUT);
          }
        },
        onFailure: (e) => {
          setLoading(false);
          notify(e.message ? e.message : translate("indexable_attribute.update_fail_message"), "error", TIMEOUT);
        },
      },
    );
  };

  if (loading) {
    return <LoaderComponent />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  return (
    <>
      <Box width="40%">
        <Grid container className={classes.formHeader}>
          <Grid item xs={8}>
            <Typography className={classes.formHeaderLabel}>
              {translate("indexable_attribute.lookBack_window_heading_first")}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box width="40%">
        <Grid container className={classes.formContent} alignItems="center">
          <Grid item xs={6}>
            <Typography className={classes.formContentLabel}>
              {translate("indexable_attribute.look_back_window.no_of_days")}
            </Typography>
          </Grid>
          <Grid item xs={6} className={classes.textRight}>
            <FormControl>
              <TextField
                type="number"
                name="value"
                InputProps={{ inputProps: { min: 0, className: classes.inputPadding } }}
                className={classes.formInputClass}
                variant="outlined"
                value={value}
                onChange={onLookBackWindowChange}
                error={value < 0}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <CallToAction
          isInvalidValue={isInvalidValue}
          handleUpdateAction={updateFieldsByDomainAPI}
          handleResetAction={resetConfiguration}
        />
      </Box>
    </>
  );
};

LookBackWindow.propTypes = {
  domain: PropTypes.string.isRequired,
};

export default LookBackWindow;
