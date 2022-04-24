/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { useTranslate, useNotify } from "react-admin";
import useStyles from "../../../../../assets/theme/common";
import DynamicFieldsList from "../../../../../components/DynamicFieldsList";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import AutoComplete from "../../../../../components/AutoComplete";
import { generateUniqueId } from "../../../../../utils/helperFunctions";
/**
 * CreateProductFeature
 *
 * @returns {React.Component} //return component
 */
const CreateProductFeature = () => {
  const classes = useStyles();
  const notify = useNotify();
  const translate = useTranslate();

  const [state, setState] = useState({
    filterList: [{ feature: null, value: null }],
    apiParams: {
      type: "getData",
      url: `${window.REACT_APP_GEMS_SERVICE}/features/types`,
      sortParam: "id",
      sortDirc: "ASC",
      fieldName: "name",
      fieldId: "id",
    },
  });

  const { filterList, apiParams } = state;

  /**
   * Function to call the action for updating selected entity group
   *
   * @name onAddtition
   * @param {number} index position
   */
  const onAddtition = (index) => {
    let validationError = false;
    const data = filterList[index];
    if (!Object.entries(data).length) {
      validationError = true;
    }
    Object.entries(data).forEach(([, value]) => {
      if (!value) {
        validationError = true;
        return false;
      }
      return true;
    });
    if (!validationError) {
      const tempList = [...state.filterList];
      tempList.push({ feature: null, value: null });
      setState((prevState) => ({
        ...prevState,
        filterList: [...tempList],
      }));
    } else {
      notify(translate("fill_required_field"), "error", TIMEOUT);
    }
  };

  /**
   * Function to call the action for updating selected entity group
   *
   * @name onDeletion
   * @param {number} index filter index value of array
   */
  const onDeletion = (index) => {
    const tempList = [...state.filterList];
    if (index > -1) {
      tempList.splice(index, 1);
    }
    setState((prevState) => ({ ...prevState, filterList: [...tempList] }));
  };

  /**
   * Function to call the action for updating primary value
   *
   * @name handleIndexValue
   * @param {object} event event object
   * @param {string} name field name
   * @param {number} index index
   */
  const handleIndexValue = (event, name, index) => {
    const tempValue = { ...filterList[index] };
    tempValue[name] = event;
    const tempFilterList = [...filterList];
    tempFilterList[index] = { ...tempValue };
    setState((prevState) => ({ ...prevState, filterList: [...tempFilterList] }));
  };

  return (
    <Grid container spacing={2} justify="center" className={classes.gridStyle}>
      {filterList.map((val, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid item xs={8} key={index}>
          <DynamicFieldsList
            fieldList={[
              <AutoComplete
                name={`featureName-${generateUniqueId(index)}`}
                source={`featureName-${generateUniqueId(index)}`}
                label={translate("feature_type_name")}
                dataId="feature_type_name"
                apiParams={{ ...apiParams }}
                onOpen
                value={filterList[index].feature}
                onChange={(e, newValue) => handleIndexValue(newValue, "feature", index)}
              />,
              <AutoComplete
                name={`feature_value-${index}`}
                source={`feature_value-${index}`}
                label={translate("feature_value")}
                dataId="feature_type_name"
                apiParams={{
                  ...apiParams,
                  url: `${window.REACT_APP_GEMS_SERVICE}features/values?feature-type=${filterList[index]?.feature?.id}`,
                  fieldName: "value",
                }}
                onOpen
                value={filterList[index].value}
                onChange={(e, newValue) => handleIndexValue(newValue, "value", index)}
                disabled={!filterList[index]?.feature?.id}
              />,
            ]}
            key={`-${generateUniqueId(index)}-`}
            lastItem={index === filterList.length - 1}
            onSubmit={() => {
              // eslint-disable-next-line no-unused-expressions
              index === filterList.length - 1 ? onAddtition(index) : onDeletion(index);
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CreateProductFeature;
