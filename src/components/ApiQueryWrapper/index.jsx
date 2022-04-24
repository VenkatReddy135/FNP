/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import { Grid, Typography } from "@material-ui/core";
import { isArray, isPlainObject } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useInput, useNotify, useMutation, useTranslate, SimpleForm } from "react-admin";
import { onFailure, onSuccess } from "../../utils/CustomHooks";
import Checkbox from "../BoundedCheckBoxDropdown";
import Dropdown from "../Dropdown";
import useStyles from "./style";

const Components = {
  dropdown: Dropdown,
  checkbox: Checkbox,
};

/**
 * @function ApiQueryWrapper To provide data options for custom component through api params
 * @param {*} props props of the Auto complete
 * @returns {React.Component} return component
 */
const ApiQueryWrapper = (props) => {
  const { as, source, edit, label, apiParams, className, ...rest } = props;

  const notify = useNotify();
  const translate = useTranslate();
  const [mutate] = useMutation();
  const classes = useStyles();

  const data = useInput(props);

  const input = data && data?.input;
  const value = input && input?.value;

  const formValue = isArray(value)
    ? {
        value: value.map((item) => (isPlainObject(item) ? item.name : item)),
        dropdown: value.map((item) => (isPlainObject(item) ? item.id : item)),
      }
    : {
        value: isPlainObject(value) ? value.name : value,
        dropdown: isPlainObject(value) ? value.id : value,
      };

  const { fieldName, type, url, sortParam, fieldId, size, defaultOptions = [] } = apiParams;
  const [optionsValue, setOptionsValue] = useState([]);

  const params = {
    ...(size && { size }),
    ...(sortParam && { sortParam: `${sortParam}:asc` }),
  };

  /**
   * @function handleSuccess handles the success.
   * @param {object} res response.
   */
  const handleSuccess = (res) => {
    if (res?.data?.data) {
      const options = res.data.data.map((item) => ({ id: item[fieldId], name: item[fieldName] }));
      setOptionsValue(options);
    } else {
      setOptionsValue(defaultOptions);
    }
  };

  /**
   * @function queryHandler handle the query request.
   */
  const queryHandler = () => {
    mutate(
      {
        type,
        resource: url,
        payload: params,
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
          setOptionsValue(defaultOptions);
        },
      },
    );
  };

  useEffect(() => {
    if (type && url && params) queryHandler();
    else if (defaultOptions.length) {
      setOptionsValue(defaultOptions);
    }
  }, []);

  const CurrentComponent = Components[as];

  if (!edit) {
    return (
      <Grid item container direction="column" data-testid="editIsFalse">
        <Typography variant="caption">{label}</Typography>
        <Typography variant="h6">{formValue.value.join("; ")}</Typography>
      </Grid>
    );
  }

  return (
    <SimpleForm initialValues={formValue} toolbar={<></>} className={className || classes.wrapper}>
      <CurrentComponent
        edit={edit}
        label={label}
        source={formValue[as] ? as : "value"}
        data={optionsValue}
        options={optionsValue}
        {...rest}
      />
    </SimpleForm>
  );
};

ApiQueryWrapper.propTypes = {
  as: PropTypes.string,
  apiParams: PropTypes.objectOf(PropTypes.any).isRequired,
  label: PropTypes.string,
  edit: PropTypes.bool,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
  validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.any]),
  source: PropTypes.string,
  className: PropTypes.string,
};

ApiQueryWrapper.defaultProps = {
  as: "dropdown",
  label: "",
  validate: null,
  edit: true,
  disabled: false,
  onSelect: null,
  source: null,
  className: null,
};
export default ApiQueryWrapper;
