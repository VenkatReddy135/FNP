/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { SimpleForm, useTranslate, useNotify, useMutation, useRefresh } from "react-admin";
import { useHistory } from "react-router-dom";
import { Grid, Box } from "@material-ui/core";
import useStyles from "../../../assets/theme/common";
import { TIMEOUT } from "../../../config/GlobalConfig";
import CustomAutoComplete from "../../../components/CustomAutoComplete";
import LoaderComponent from "../../../components/LoaderComponent";
import CustomToolbar from "../../../components/CustomToolbar";
import DropDown from "../../../components/Dropdown";
import { useCustomQueryWithStore } from "../../../utils/CustomHooks";

/**
 * Component for Product Management search UI
 *
 * @returns {React.ReactElement} returns a Product Management search UI component
 */
const ProductSearchUI = () => {
  const translate = useTranslate();
  const history = useHistory();
  const notify = useNotify();
  const classes = useStyles();
  const refresh = useRefresh();
  const [mutate] = useMutation();
  const [state, setState] = useState({
    classificationItems: [],
    typeItems: [],
    subTypeItems: [],
    selectedClassification: "",
    selectedType: "",
    selectedSubType: "",
    apiParams: {
      type: "getData",
      url: `${window.REACT_APP_GEMS_SERVICE}products`,
      sortParam: "id",
      sortDirc: "ASC",
    },
    geoApiParms: {
      type: "getData",
      url: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
      sortParam: "tagName",
      fieldName: "tagName",
      fieldId: "tagId",
    },
    isReady: false,
  });
  const {
    classificationItems,
    selectedClassification,
    typeItems,
    selectedType,
    subTypeItems,
    apiParams,
    geoApiParms,
    isReady,
  } = state;

  /**
   * @function filterPostObject will filter the empty and null values from the post object
   * @param {object} postObject is passed to the function
   * @returns {object} returns a new modified object which has no empty keys
   */
  const filterPostObject = (postObject) => {
    const filteredObj = {};
    Object.keys(postObject).forEach((key) => {
      if (postObject[key]) {
        filteredObj[key] = postObject[key];
      }
    });
    return Object.entries(filteredObj);
  };

  /**
   * @function filterData will return item name based on id
   * @param {string} id is passed to the function
   * @param {Array} list is passed to the function
   * @returns {string} name of item
   */
  const filterData = (id, list) => {
    let res = null;
    list.forEach((val) => {
      if (val.id === id) {
        res = val.name;
      }
    });
    return res;
  };

  /**
   * @function handleSubmit function called on Apply button
   * @param {object} searchObj contains form field values
   */
  const handleSubmit = (searchObj) => {
    const productSearch = {
      skuCode: searchObj?.skuId?.name,
      id: searchObj?.prodId?.name,
      name: searchObj?.prodName?.name,
      countryOfOrigin: searchObj?.geoId?.name,
      type: searchObj?.productTypeVal?.length ? filterData(searchObj.productTypeVal, typeItems) : null,
      subType: searchObj?.productSubTypeVal?.length ? filterData(searchObj.productSubTypeVal, subTypeItems) : null,
      classification: searchObj?.classificationVal?.length
        ? filterData(searchObj.classificationVal, classificationItems)
        : null,
    };
    const filteredPostSearchObj = filterPostObject(productSearch);
    if (!filteredPostSearchObj.length) {
      notify(translate("error_message"), "error", TIMEOUT);
    } else {
      const filterArray = filteredPostSearchObj.map((val) => {
        return { fieldName: val[0], operatorName: "EqualTo", fieldValue: val[1] };
      });
      const temp = { filter: btoa(JSON.stringify(filterArray)) };
      history.push({
        pathname: `/${window.REACT_APP_GEMS_SERVICE}products`,
        search: `?filter=${JSON.stringify(temp)}`,
      });
    }
  };

  /**
   * @function cancelHandler
   */
  const cancelHandler = () => {
    setState({
      classificationItems: [],
      typeItems: [],
      subTypeItems: [],
      selectedClassification: "",
      selectedType: "",
      selectedSubType: "",
      apiParams: {
        type: "getData",
        url: `${window.REACT_APP_GEMS_SERVICE}products`,
        sortParam: "id",
        sortDirc: "ASC",
      },
      geoApiParms: {
        type: "getData",
        url: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
        sortParam: "tagName",
        fieldName: "tagName",
        fieldId: "tagId",
      },
      isReady: false,
    });
    refresh();
  };

  /**
   * @function handleSuccess This function will handle the after effects of success.
   * @param {object} response is passed to the function
   * @param {string} key to set state
   */
  const handleSuccess = (response, key) => {
    const dropdownDataArray = response?.data?.data?.map((element) => {
      return { id: element.id, name: element.name };
    });
    setState((prevState) => ({ ...prevState, [key]: [...dropdownDataArray], isReady: true }));
  };

  /**
   * @function setDropDown This function will handle the after effects of success.
   * @param {string} val is passed to the function
   * @param {string} key to set state
   */
  const setDropDown = (val, key) => {
    setState((prevState) => ({ ...prevState, [key]: val }));
  };

  /**
   * @function getDropDown This function will handle the after effects of success.
   * @param {string} resource is passed to the function
   * @param {object} payload is passed to the function
   * @param {string} key to set state
   */
  const getDropDown = (resource, payload, key) => {
    mutate(
      {
        type: "getData",
        resource,
        payload,
      },
      {
        onSuccess: (res) => {
          if (res.data && res.status === "success") {
            handleSuccess(res, key);
          } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
            notify(
              res.data.errors[0].field
                ? `${res.data.errors[0].field} ${res.data.errors[0].message}`
                : `${res.data.errors[0].message}`,
            );
          }
        },
        onFailure: (error) => {
          notify(`Error: ${error.message}`, "error", TIMEOUT);
        },
      },
    );
  };

  useCustomQueryWithStore("getData", `${window.REACT_APP_GEMS_SERVICE}products/classifications`, (response) => {
    handleSuccess(response, "classificationItems");
  });

  useEffect(() => {
    if (selectedClassification) {
      getDropDown(
        `${window.REACT_APP_GEMS_SERVICE}products/types?classificationId=${[selectedClassification]}`,
        {},
        "typeItems",
      );
    }
  }, [selectedClassification]);

  useEffect(() => {
    if (selectedType) {
      getDropDown(`${window.REACT_APP_GEMS_SERVICE}products/sub-types?typeIds=${[selectedType]}`, {}, "subTypeItems");
    }
  }, [selectedType]);

  return (
    <Box maxWidth={850}>
      {isReady ? (
        <SimpleForm
          save={handleSubmit}
          toolbar={<CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("apply")} />}
        >
          <Grid container>
            <Grid item xs data-testid="skuId">
              <CustomAutoComplete
                source="skuId"
                label={translate("sku_id")}
                dataId="skuCode"
                apiParams={{ ...apiParams, fieldId: "skuCode", fieldName: "skuCode" }}
                onOpen
                isbtoa
                autoCompleteClass={classes.autoCompleteItem}
              />
            </Grid>
            <Grid item xs data-testid="prodId">
              <CustomAutoComplete
                source="prodId"
                label={translate("product_id")}
                dataId="id"
                apiParams={{ ...apiParams, fieldId: "id", fieldName: "id" }}
                onOpen
                isbtoa
                autoCompleteClass={classes.autoCompleteItem}
              />
            </Grid>
            <Grid item xs data-testid="prodName">
              <CustomAutoComplete
                source="prodName"
                label={translate("product_name")}
                dataId="productName"
                apiParams={{ ...apiParams, fieldId: "name", fieldName: "name" }}
                onOpen
                isbtoa
                autoCompleteClass={classes.autoCompleteItem}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs data-testid="classificationVal">
              <Box width={250}>
                <DropDown
                  label={translate("product_classification")}
                  source="classificationVal"
                  data={classificationItems}
                  edit
                  onSelect={(e) => {
                    setDropDown(e.target.value, "selectedClassification");
                  }}
                  gridSize={{ xs: 12 }}
                />
              </Box>
            </Grid>
            <Grid item xs data-testid="geoId">
              <CustomAutoComplete
                source="geoId"
                label={translate("product_geography")}
                dataId="countryOfOrigin"
                apiParams={geoApiParms}
                additionalFilters={[{ fieldName: "tagTypeId", operatorName: "Like", fieldValue: "G" }]}
                onOpen
                autoCompleteClass={classes.autoCompleteItem}
              />
            </Grid>
            <Grid item xs data-testid="productTypeVal">
              <Box width={250}>
                <DropDown
                  label={translate("product_type")}
                  source="productTypeVal"
                  data={typeItems}
                  edit
                  onSelect={(e) => {
                    setDropDown(e.target.value, "selectedType");
                  }}
                  disabled={!selectedClassification}
                  gridSize={{ xs: 12 }}
                />
              </Box>
            </Grid>
            {Boolean(selectedType && subTypeItems.length) && (
              <Grid item xs={10}>
                <Box width={250}>
                  <DropDown
                    label={translate("product_sub_type")}
                    source="productSubTypeVal"
                    data={subTypeItems}
                    edit
                    onSelect={(e) => {
                      setDropDown(e.target.value, "selectedSubType");
                    }}
                    gridSize={{ xs: 12 }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </SimpleForm>
      ) : (
        <LoaderComponent />
      )}
    </Box>
  );
};

export default React.memo(ProductSearchUI);
