/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { SelectInput, useTranslate, required, NumberInput, TextInput, useInput } from "react-admin";
import { Grid } from "@material-ui/core";
import useStyles from "../../../../../../assets/theme/common";
import GenericRadioGroup from "../../../../../../components/RadioGroup";
import BoundedCheckBoxDropdown from "../../../../../../components/BoundedCheckBoxDropdown";
import { handleInvalidCharsInNumberInput } from "../../../../../../utils/validationFunction";
import { useCustomQueryWithStore } from "../../../../../../utils/CustomHooks";

/**
 * Component for Generic Simple Form for Personalization
 *
 * @param {*} props all the props needed to display a simple form.
 * @param {Boolean} props.isEditable to switch between edit and view mode.
 * @param {object} props.match is used to get the id from match.params.id.
 * @returns {React.ReactElement} returns a generic simple form component
 */
const PersonalizationSimpleForm = (props) => {
  const { isEditable, match } = props;
  const productId = match?.params?.id;
  const requiredValidate = [required()];
  const translate = useTranslate();
  const classes = useStyles();
  const { input } = useInput(props);
  const { value } = input;
  const { contentType } = value;
  const [contentTypeArray, setContentTypeData] = useState([]);
  const [miscArray, setMiscArray] = useState({
    media: [],
    sizeUnit: [],
    allowedMediaTypes: [],
  });

  const isRequired = [
    { id: true, name: "Yes" },
    { id: false, name: "No" },
  ];

  /**
   * @function handleSuccess This function will handle the after effects of success.
   * @param {object} response is passed to the function
   */
  const handleSuccess = (response) => {
    const contentTypeList = response?.data?.data?.map((element) => {
      return { id: element.contentTypeId, name: element.contentTypeName };
    });
    setContentTypeData(contentTypeList);
  };

  useCustomQueryWithStore("getData", `${window.REACT_APP_TIFFANY_SERVICE}/content-types`, handleSuccess, {
    payload: { productId },
  });
  useEffect(() => {
    const getMediaTypes = miscArray?.media?.filter((item) => item?.contentTypeId === contentType);
    const mediaSize = getMediaTypes[0]?.supportedSize?.map((item) => {
      return { id: item?.uomId, name: item?.uomDescription };
    });
    const mediaTypes = getMediaTypes[0]?.supportedMediaTypes?.map((item) => {
      return { id: item?.mediaTypeId, name: item?.mediaTypeName };
    });
    setMiscArray((prev) => {
      return { ...prev, sizeUnit: mediaSize, allowedMediaTypes: mediaTypes };
    });
  }, [contentType]);

  /**
   * @function handleDataSuccess This function will handle the after effects of success.
   * @param {object} response is passed to the function
   */
  const handleDataSuccess = (response) => {
    const { data } = response?.data;
    setMiscArray((prev) => {
      return { ...prev, media: [...data] };
    });
  };

  useCustomQueryWithStore(
    "getData",
    `${window.REACT_APP_BEAUTYPLUS_SERVICE}/sites/content-media-mappings`,
    handleDataSuccess,
  );

  return (
    <>
      <Grid container>
        <Grid item md={3}>
          <SelectInput
            source="contentType"
            choices={contentTypeArray}
            validate={requiredValidate}
            disabled={!isEditable}
            label={translate("content_type")}
            className={classes.autoCompleteItem}
            data-testid="content_type"
          />
        </Grid>
        <Grid item md={3}>
          <NumberInput
            source="minimumQuantity"
            className={classes.numberInputField}
            disabled={!isEditable}
            label={translate("minimum_quantity_allowed")}
            data-testid="min_quantity"
            autoComplete="off"
            min={1}
            validate={requiredValidate}
            onKeyDown={handleInvalidCharsInNumberInput}
          />
        </Grid>
        <Grid item md={3}>
          <NumberInput
            source="maximumQuantity"
            className={classes.numberInputField}
            disabled={!isEditable}
            label={translate("maximum_quantity_allowed")}
            data-testid="max_quantity"
            autoComplete="off"
            min={1}
            validate={requiredValidate}
            onKeyDown={handleInvalidCharsInNumberInput}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={3}>
          <NumberInput
            source="minimumSize"
            className={classes.numberInputField}
            disabled={!isEditable}
            label={translate("min_size")}
            data-testid="min_size"
            autoComplete="off"
            min={1}
            validate={requiredValidate}
            onKeyDown={handleInvalidCharsInNumberInput}
          />
        </Grid>
        <Grid item md={3}>
          <SelectInput
            source="minimumSizeUnit"
            choices={miscArray?.sizeUnit}
            disabled={!isEditable}
            validate={requiredValidate}
            label={translate("min_size_unit")}
            className={classes.autoCompleteItem}
            data-testid="min_size_unit"
          />
        </Grid>
        <Grid item md={3}>
          <NumberInput
            source="maximumSize"
            className={classes.numberInputField}
            disabled={!isEditable}
            label={translate("max_size_allowed")}
            data-testid="max_size_allowed"
            autoComplete="off"
            min={1}
            validate={requiredValidate}
            onKeyDown={handleInvalidCharsInNumberInput}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={3}>
          <SelectInput
            source="maximumSizeUnit"
            choices={miscArray?.sizeUnit}
            disabled={!isEditable}
            validate={requiredValidate}
            label={translate("max_size_unit")}
            className={classes.autoCompleteItem}
            data-testid="max_size_unit"
          />
        </Grid>
        <Grid item md={3}>
          <BoundedCheckBoxDropdown
            source="allowedMediaTypes"
            id={translate("allowed_media_types")}
            label={translate("allowed_media_types")}
            disabled={!isEditable}
            selectAll
            validate={requiredValidate}
            className={classes.autoCompleteItem}
            options={miscArray?.allowedMediaTypes}
          />
        </Grid>
        <Grid item md={3}>
          <TextInput
            source="label"
            label={translate("label")}
            className={classes.autoCompleteItem}
            disabled={!isEditable}
            data-testid="label"
            validate={requiredValidate}
            autoComplete="off"
            variant="standard"
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={3}>
          <NumberInput
            source="sequence"
            className={classes.numberInputField}
            disabled={!isEditable}
            label={translate("sequence_number")}
            data-testid="sequence"
            autoComplete="off"
            min={1}
            validate={requiredValidate}
            onKeyDown={handleInvalidCharsInNumberInput}
          />
        </Grid>
        <Grid item md={3}>
          <TextInput
            source="fieldName"
            label={translate("field_name")}
            disabled={!isEditable}
            className={classes.autoCompleteItem}
            data-testid="field_name"
            validate={requiredValidate}
            autoComplete="off"
            variant="standard"
          />
        </Grid>
        <Grid item md={3}>
          <GenericRadioGroup
            disabled={!isEditable}
            label={translate("required_text")}
            source="isRequired"
            choices={isRequired}
            editable={isEditable}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={3}>
          <GenericRadioGroup
            disabled={!isEditable}
            label={translate("full_width")}
            source="isFullWidth"
            choices={isRequired}
            editable={isEditable}
          />
        </Grid>
        {contentType?.toLowerCase() === "text" && (
          <Grid item md={3}>
            <GenericRadioGroup
              disabled={!isEditable}
              label={translate("is_a_message_on_product")}
              source="isMessageOnProduct"
              choices={isRequired}
              editable={isEditable}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

PersonalizationSimpleForm.propTypes = {
  isEditable: PropTypes.bool,
  match: PropTypes.objectOf(PropTypes.any),
};

PersonalizationSimpleForm.defaultProps = {
  isEditable: true,
  match: {},
};

export default PersonalizationSimpleForm;
