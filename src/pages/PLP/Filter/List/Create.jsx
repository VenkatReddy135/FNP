/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm, useNotify, useMutation, useRedirect } from "react-admin";
import { DialogContent, Grid, TextField, Typography } from "@material-ui/core";
import debounce from "lodash/debounce";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SimpleModel from "../../../../components/CreateModal";
import useStyles from "../../../../assets/theme/common";
import useStylesFilter from "../FilterStyle";
import {
  TIMEOUT,
  FILTER_TAG_TYPE_ID,
  FILTER_TAG_OPERATOR_LIKE,
  FILTER_TAG_VALUE_PRODUCT,
  FILTER_TAG_NAME,
  DEBOUNCE_INTERVAL,
} from "../../../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks";
import CustomToolbar from "../../../../components/CustomToolbar";

/**
 * Component for PLP filter Create
 *
 * @param {object} props geo name etc the props needed for PLP filter List
 * @returns {React.ReactElement} returns a PLP filter List component
 */
const Create = (props) => {
  const { geo, openCreateFilterModel, setOpenCreateFilterModel } = props;
  const translate = useTranslate();
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const notify = useNotify();
  const redirect = useRedirect();
  const [mutate] = useMutation();
  const classes = useStyles();
  const filterClasses = useStylesFilter();

  /**
   * @function handleSuccess This function will handle Success
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    setProductTypes(res.data.data);
  };

  /**
   * @function handleInputChange function that updates the changed value of selected domain
   * @param {string} newValue contains value
   */
  const handleInputChange = (newValue) => {
    const params = {
      size: 100,
      sortParam: `${FILTER_TAG_NAME}:asc`,
    };
    const filter = [
      {
        fieldName: FILTER_TAG_TYPE_ID,
        operatorName: FILTER_TAG_OPERATOR_LIKE,
        fieldValue: FILTER_TAG_VALUE_PRODUCT,
      },
    ];

    if (newValue) {
      filter.push({
        fieldName: FILTER_TAG_NAME,
        operatorName: FILTER_TAG_OPERATOR_LIKE,
        fieldValue: newValue,
      });
    }
    params.filter = encodeURIComponent(JSON.stringify(filter));
    mutate(
      {
        type: "getOne",
        resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
        payload: params,
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  /**
   * @function cancelFilter Function to close dialog
   */
  const closeFilterDialog = () => {
    setSelectedProductType("");
    setProductTypes([]);
    setOpenCreateFilterModel(false);
  };

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} res is passed to the function
   */
  const handleUpdateSuccess = (res) => {
    setSelectedProductType("");
    setOpenCreateFilterModel(false);
    notify(translate("plp_global_filter.create_success"));
    setProductTypes([]);
    redirect(`/${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs/${res.data.id}`);
  };

  /**
   *@function createFilter To create the product
   *
   */
  const createFilter = () => {
    if (selectedProductType) {
      mutate(
        {
          type: "create",
          resource: `${window.REACT_APP_COLUMBUS_SERVICE}/productfilterconfigs`,
          payload: {
            data: {
              params: null,
              dataObj: {
                geoId: geo,
                productTypeId: selectedProductType,
              },
            },
          },
        },
        {
          onSuccess: (response) => {
            onSuccess({ response, notify, translate, handleSuccess: handleUpdateSuccess });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate });
          },
        },
      );
    } else {
      notify(translate("fill_required_field"), "error", TIMEOUT);
    }
  };

  const inputChangeWithDebounce = debounce((event, newInputValue) => {
    handleInputChange(newInputValue);
  }, DEBOUNCE_INTERVAL);

  /**
   * Function to call the action for updating selected Product type
   *
   * @name handleProductChangeType
   * @param {string} newValue contains Product type value
   */
  const handleProductChangeType = (newValue) => {
    setSelectedProductType(newValue && newValue.tagId);
  };
  const customToolbar = (
    <CustomToolbar
      onClickCancel={closeFilterDialog}
      saveButtonLabel={translate("create")}
      className={filterClasses.createButtonToolbar}
    />
  );
  /**
   * @function dialogContent
   * @returns {React.createElement} returning ui for create filter page
   */
  const dialogContent = () => {
    return (
      <DialogContent>
        <Typography variant="h6" className={classes.textAlignCenter}>
          {translate("plp_global_filter.create")}
        </Typography>
        <SimpleForm save={createFilter} toolbar={customToolbar}>
          <Grid container justify="space-between">
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <Autocomplete
                options={productTypes}
                closeIcon={false}
                getOptionLabel={(option) => option.tagName}
                className={classes.autoCompleteItem}
                onInputChange={inputChangeWithDebounce}
                onOpen={(event) => {
                  handleInputChange(event.target.value);
                }}
                onChange={(e, newValue) => {
                  handleProductChangeType(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} required label={translate("plp_global_filter.product_type")} margin="normal" />
                )}
              />
            </Grid>
          </Grid>
        </SimpleForm>
      </DialogContent>
    );
  };

  return (
    <>
      <SimpleModel
        dialogContent={dialogContent()}
        openModal={openCreateFilterModel}
        handleClose={() => setOpenCreateFilterModel(false)}
      />
    </>
  );
};

Create.propTypes = {
  geo: PropTypes.string.isRequired,
  openCreateFilterModel: PropTypes.bool.isRequired,
  setOpenCreateFilterModel: PropTypes.func.isRequired,
};

export default Create;
