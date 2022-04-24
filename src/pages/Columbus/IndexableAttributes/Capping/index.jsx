import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslate, useNotify, useMutation } from "react-admin";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSelector, useDispatch } from "react-redux";
import { Grid, Typography, TextField, Box, FormControl } from "@material-ui/core";
import { isEmpty } from "lodash";
import LoaderComponent from "../../../../components/LoaderComponent";
import { saveFormData } from "../../../../actions/columbus";
import useStyle from "./cappingStyles";
import CallToAction from "../CallToAction";
import { TIMEOUT } from "../../../../config/GlobalConfig";

/**
 * Capping component for displaying Capping form
 *
 * @param {object} props contains data related to Capping from
 * @returns {React.ReactElement} Capping from.
 */
const Capping = (props) => {
  const { domain } = props;
  const translate = useTranslate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    apiFormData: { capping, error },
  } = useSelector((state) => state.columbus);
  const classes = useStyle();
  const cappingArray = Object.keys(capping);
  const notify = useNotify();
  const [mutate] = useMutation();
  const resource = `${window.REACT_APP_COLUMBUS_SERVICE}/configurations/suggestiongroups`;
  const [apiError, setApiError] = useState(false);

  // We are not calling get API when we switch to tabs.
  // IF API gives any error react admin re-renders the component. to avoid this added condition
  useEffect(() => {
    setApiError(false);
  }, [domain]);

  // Created this object maintain the labels of the fields
  const cappingForm = {
    totalResult: translate("indexable_attribute.capping.total_result"),
    boostedSearch: translate("indexable_attribute.capping.boosted_search"),
    recentSearch: translate("indexable_attribute.capping.recent_search"),
    popularSearch: translate("indexable_attribute.capping.popular_search"),
  };

  /**
   * To get manage sequence to show on the UI
   *
   * @name manageSequenceOfFields
   * @param {object} cappingObject domain name
   * @returns {object} updated Capping fields with required sequence.
   */
  const manageSequenceOfFields = (cappingObject) => {
    let updatedCapping = {};
    if (cappingObject) {
      updatedCapping = Object.keys(cappingForm).reduce((cappingAcc, key) => {
        return { ...cappingAcc, [key]: cappingObject[key] };
      }, {});
    }
    return updatedCapping;
  };

  /**
   * To get capping fields by domain name
   *
   * @name getCappingFieldsByDomainAPI
   */
  const getCappingFieldsByDomainAPI = () => {
    mutate(
      {
        type: "getData",
        resource,
        payload: { domainId: domain },
      },
      {
        enabled: domain.toLowerCase() !== "",
        onSuccess: (res) => {
          if (res.status === "success" && res.data) {
            const updatedFields = manageSequenceOfFields(res.data);
            dispatch(saveFormData({ capping: updatedFields }));
            setLoading(false);
          } else {
            setLoading(false);
            setApiError(true);
            dispatch(saveFormData({ capping: {} }));
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
          id: { domainId: domain.toLowerCase() },
          data: capping,
        },
      },
      {
        onSuccess: (res) => {
          setLoading(false);
          if (res.status === "success" && res.data) {
            const updatedFields = manageSequenceOfFields(res.data);
            dispatch(saveFormData({ capping: updatedFields }));
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
          id: { domainId: domain.toLowerCase() },
          data: {},
        },
      },
      {
        onSuccess: (res) => {
          if (res.status === "success" && res.data) {
            getCappingFieldsByDomainAPI();
            notify(translate("indexable_attribute.reset_success_message"), "info", TIMEOUT);
          } else {
            setLoading(false);
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

  useEffect(() => {
    if (isEmpty(cappingArray) && !loading && !apiError) {
      setLoading(true);
      getCappingFieldsByDomainAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capping]);

  // To validate value is less than 0
  const inValidCapping = cappingArray.filter((key) => capping[key] < 0);
  const isInvalidValue = !!inValidCapping.length;

  /**
   * Function to maintain values changed in the capping form
   *
   * @name onCappingChange
   * @param {object} e contains data of the input
   */
  const onCappingChange = (e) => {
    const cappingObject = { ...capping };
    const { name, value } = e.target;
    cappingObject[name] = value * 1;
    const { totalResult, boostedSearch, recentSearch } = cappingObject;
    cappingObject.popularSearch = totalResult - (boostedSearch + recentSearch);
    dispatch(saveFormData({ capping: cappingObject }));
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
          <Grid item xs={6}>
            <Typography className={classes.formHeaderLabel}>
              {translate("indexable_attribute.capping_heading_first")}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box width="40%">
        {cappingArray.map((key) => {
          return (
            <Grid container key={key} className={classes.formContent} alignItems="center">
              <Grid item xs={6}>
                <Typography className={classes.formContentLabel}>{cappingForm[key]}</Typography>
              </Grid>
              <Grid item xs={6} className={classes.textRight}>
                <FormControl>
                  {key === "popularSearch" ? (
                    <div
                      data-test={key}
                      className={`${classes.formNonEditableField} ${capping[key] < 0 ? classes.error : ""}`}
                    >
                      {capping[key]}
                    </div>
                  ) : (
                    <TextField
                      type="number"
                      name={key}
                      InputProps={{ inputProps: { min: 0, className: classes.inputPadding } }}
                      className={classes.formInputClass}
                      variant="outlined"
                      value={capping[key]}
                      onChange={onCappingChange}
                      error={capping[key] < 0}
                      data-test={key}
                    />
                  )}
                </FormControl>
              </Grid>
            </Grid>
          );
        })}
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

Capping.propTypes = {
  domain: PropTypes.string.isRequired,
};

export default Capping;
