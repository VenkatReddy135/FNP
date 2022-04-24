import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, Typography, TextField, Box, FormControl } from "@material-ui/core";
import { useTranslate, useNotify, useMutation } from "react-admin";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSelector, useDispatch } from "react-redux";
import { toPairs, fromPairs, sortBy, isEmpty } from "lodash";
import useStyle from "./WeightageStyles";
import CallToAction from "../CallToAction";
import Total from "../Total";
import WeightageHeader from "../WeightageHeader";
import { saveFormData } from "../../../../actions/columbus";
import LoaderComponent from "../../../../components/LoaderComponent";
import { TIMEOUT } from "../../../../config/GlobalConfig";

/**
 * Weightage component adding weightage
 *
 * @name Weightage
 * @param {object} props contains data related to Weightage from
 * @returns {React.ReactElement} Weightage from.
 */
const Weightage = (props) => {
  const { domain } = props;
  const [loading, setLoading] = useState(false);
  const classes = useStyle();
  const translate = useTranslate();
  const {
    apiFormData: { weightage, error, weightageFormValues },
  } = useSelector((state) => state.columbus);
  const dispatch = useDispatch();
  const weightageArray = Object.keys(weightage);
  const notify = useNotify();
  const [mutate] = useMutation();
  const resource = `${window.REACT_APP_COLUMBUS_SERVICE}/configurations/indexfields`;
  const [apiError, setApiError] = useState(false);

  // We are not calling get API when we switch to tabs.
  // IF API gives any error react admin re-renders the component. to avoid this added condition
  useEffect(() => {
    setApiError(false);
  }, [domain]);

  /**
   * To create a Weightage object for saving into DB
   *
   * @name createWeightageObject
   * @param {object} response contains data from API
   * @returns {object} updated weightage fields
   */
  const createWeightageObject = (response) => {
    let weightageObject = {};
    if (response) {
      weightageObject = response.reduce((weightageAcc, { fieldName, fieldVal }) => {
        return { ...weightageAcc, [fieldName]: fieldVal };
      }, {});
    }
    return weightageObject;
  };

  /**
   * To get the labels by key
   *
   * @name getFieldLabelByName
   * @param {string} key contains data from API
   * @returns {string} label of the field
   */
  const getFieldLabelByName = (key) => {
    let label = "";
    if (weightageFormValues) {
      const { fieldDisplayName } = weightageFormValues.find(({ fieldName }) => fieldName === key);
      label = fieldDisplayName;
    }

    return label;
  };

  /**
   * To get index fields by domain name
   *
   * @name getFieldsByDomainAPI
   */
  const getFieldsByDomainAPI = () => {
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
            dispatch(saveFormData({ weightage: createWeightageObject(res.data), weightageFormValues: res.data }));
            setLoading(false);
          } else {
            setLoading(false);
            setApiError(true);
            dispatch(saveFormData({ weightage: {}, weightageFormValues: [] }));
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
    if (isEmpty(weightageArray) && !loading && !apiError) {
      setLoading(true);
      getFieldsByDomainAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightage]);

  /**
   * To update configuration for selected domain
   *
   * @name updateFieldsByDomainAPI
   * @param {string} updatedDbFields contains updated data by user to save
   */
  const updateFieldsByDomainAPI = (updatedDbFields) => {
    setLoading(true);
    mutate(
      {
        type: "put",
        resource,
        payload: {
          id: { domainId: domain.toLowerCase() },
          data: updatedDbFields,
        },
      },
      {
        onSuccess: (res) => {
          setLoading(false);
          if (res.status === "success" && res.data) {
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
   * Call back function for Updating configurations
   *
   * @name updateConfiguration
   */
  const updateConfiguration = () => {
    const total = weightageArray.reduce((totalValue, key) => {
      return totalValue + weightage[key];
    }, 0);
    if (total !== 100) {
      notify(translate("indexable_attribute.weightage_total_error_message"), "error", TIMEOUT);
    } else {
      const updatedWeightage = weightageFormValues.map((field) => {
        const { fieldName } = field;
        return { ...field, fieldVal: weightage[fieldName] };
      });
      updateFieldsByDomainAPI(updatedWeightage);
    }
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
          setLoading(false);
          if (res.status === "success" && res.data) {
            setLoading(true);
            getFieldsByDomainAPI();
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

  // To get total of weightage added
  // This total is used to display total at the bottom
  const total = weightageArray.reduce((totalValue, key) => {
    return totalValue + weightage[key];
  }, 0);

  // To validate value is between 0 to 100
  const inValidWeightage = weightageArray.filter((key) => weightage[key] < 0 || weightage[key] > 100);
  const isInvalidValue = !!inValidWeightage.length;

  /**
   * Function to maintain values changed
   *
   * @name onWeightageChange
   * @param {object} e contains data of the input
   */
  const onWeightageChange = (e) => {
    const { name, value } = e.target;
    dispatch(saveFormData({ weightage: { ...weightage, [name]: value * 1 } }));
  };

  /**
   * Function to maintain sort the weightage
   *
   * @name onSortClick
   * @param {string} sortByValue ASC/ DESC value for sorting the object
   */
  const onSortClick = (sortByValue) => {
    const weightageObject = { ...weightage };
    let updatedWeightage = {};
    if (sortByValue === "ASC") {
      updatedWeightage = fromPairs(sortBy(toPairs(weightageObject), 1));
    } else {
      updatedWeightage = fromPairs(sortBy(toPairs(weightageObject), 1).reverse());
    }
    dispatch(saveFormData({ weightage: updatedWeightage }));
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  if (!loading && weightage.length === 0) {
    return <Typography color="error">{translate("indexable_attribute.weightage_error_message")}</Typography>;
  }
  if (loading) {
    return <LoaderComponent />;
  }
  return (
    <>
      <WeightageHeader isSort onSortClick={onSortClick} />
      <Box width="40%">
        {weightageArray.map((key) => {
          const label = getFieldLabelByName(key);
          return (
            <Grid container key={key} className={classes.formContent} alignItems="center">
              <Grid item xs={6}>
                <Typography className={classes.formContentLabel}>{label}</Typography>
              </Grid>
              <Grid item xs={6} className={classes.textRight}>
                <FormControl>
                  <TextField
                    type="number"
                    name={key}
                    InputProps={{
                      inputProps: { min: 0, max: 100, className: classes.inputPadding },
                    }}
                    className={classes.formInputClass}
                    variant="outlined"
                    value={weightage[key]}
                    onChange={onWeightageChange}
                    error={weightage[key] < 0 || weightage[key] > 100}
                    data-test={key}
                  />
                </FormControl>
              </Grid>
            </Grid>
          );
        })}
      </Box>
      <Total isInvalidValue={isInvalidValue} total={total} />
      <Box>
        <CallToAction
          isInvalidValue={isInvalidValue}
          handleUpdateAction={updateConfiguration}
          handleResetAction={resetConfiguration}
        />
      </Box>
    </>
  );
};

Weightage.propTypes = {
  domain: PropTypes.string.isRequired,
};

export default Weightage;
