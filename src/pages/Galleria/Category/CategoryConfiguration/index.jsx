/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState, useCallback } from "react";
import { DialogContent, DialogContentText } from "@material-ui/core";
import { useTranslate, useNotify, useDataProvider, useQueryWithStore, useRefresh } from "react-admin";
import DerivedCategoryList from "../DerivedCategoryList";
import CategoryConfigView from "./CategoryConfigView";
import SimpleModel from "../../../../components/CreateModal";
import useStyles from "../../../../assets/theme/common";
import LoaderComponent from "../../../../components/LoaderComponent";
import { TIMEOUT } from "../../../../config/GlobalConfig";

/**
 * Category Configuration component
 *
 * @param {*} props resource configuration
 * @returns {React.ReactElement} Configuration Component
 */
const CategoryConfiguration = (props) => {
  const classes = useStyles();
  const [editObj, updateEditObj] = useState({});
  const [editable, setEditable] = useState(false);
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const [confirmDialogObj, setConfirmDialog] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [statusFlag, setStatusFlag] = useState(true);
  const [derivedCategories, setDerivedCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [backupData, setBackUpData] = useState({});
  const { id } = props;

  const notify = useNotify();
  /**
   * parse the data in desired format
   *
   * @param {*} res data from api response
   * @returns {object} parsed data
   */
  const getParsedData = (res) => {
    const {
      configSearch,
      isIncludeInSitemap,
      productMapping,
      configSequence,
      inheritSequencingAndProductFromBase,
      contextSearch,
      isBase,
      isDerived,
      isIndependent,
      templateType,
    } = res;
    const { isSearchable, isIncludeInSearchDropdown } = configSearch;
    const { isDynamic, isManualOverride } = productMapping;
    const { featureSearchSequence, isFeatureInSearch, featureDisplayName } = contextSearch;
    const editObjRes = {
      "is-searchable": isSearchable.value,
      "inherit-is-searchable": isSearchable.inheritedValueFromBase,
      "in-search": isIncludeInSearchDropdown.value,
      "inherit-in-search": isIncludeInSearchDropdown.inheritedValueFromBase,
      "site-map": isIncludeInSitemap,
      "is-microsite-plp": templateType,
      "dynamic-product-mapping": isDynamic.value,
      "manual-product-mapping": isManualOverride.value,
      "inherit-dynamic-product-mapping": isDynamic.inheritedValueFromBase,
      "inherit-manual-product-mapping": isManualOverride.inheritedValueFromBase,
      "auto-sequencing": configSequence.isDynamic.value,
      "auto-sequencing-override": configSequence.isManualOverride.value,
      "inherit-auto-sequencing": configSequence.isDynamic.inheritedValueFromBase,
      "inherit-auto-sequencing-override": configSequence.isManualOverride.inheritedValueFromBase,
      "sequencing-product-from-base": inheritSequencingAndProductFromBase.value,
      "inherit-sequencing-product-from-base": inheritSequencingAndProductFromBase.inheritedValueFromBase,
      "feature-sequence": featureSearchSequence.value,
      "inherit-feature-sequence": featureSearchSequence.inheritedValueFromBase,
      "is-feature-in-search": isFeatureInSearch.value,
      "inherit-is-feature-in-search": isFeatureInSearch.inheritedValueFromBase,
      "feature-display": featureDisplayName.value,
      "inherit-feature-display": featureDisplayName.inheritedValueFromBase,
      "is-base": isBase,
      "is-derived": isDerived,
      "is-independent": isIndependent,
    };
    return editObjRes;
  };

  const radioGroupOptions = {
    row1: [
      { key: "is-searchable", label: translate("searchable_label"), inheritKey: "inherit-is-searchable" },
      { key: "in-search", label: translate("search_label"), inheritKey: "inherit-in-search" },
    ],
    row3: [
      {
        key: "dynamic-product-mapping",
        label: translate("product_mapping_label"),
        inheritKey: "inherit-dynamic-product-mapping",
      },
      {
        key: "auto-sequencing",
        label: translate("auto_sequencing_label"),
        inheritKey: "inherit-auto-sequencing",
      },
      {
        key: "manual-product-mapping",
        label: translate("allow_product_mapping_label"),
        inheritKey: "inherit-manual-product-mapping",
      },
    ],
    row4: [
      {
        key: "auto-sequencing-override",
        label: translate("sequencing_label"),
        inheritKey: "inherit-auto-sequencing-override",
      },
      {
        key: "sequencing-product-from-base",
        label: translate("inherit_auto_sequencing_override"),
        inheritKey: "inherit-sequencing-product-from-base",
      },
    ],
    row5: [
      {
        key: "is-feature-in-search",
        label: translate("is_featured_search_label"),
        inheritKey: "inherit-is-feature-in-search",
      },
      { key: "feature-display", label: translate("featured_display_label"), inheritKey: "inherit-feature-display" },
    ],
  };

  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}/derived-categories`,
      payload: { id },
    },
    {
      onSuccess: (res) => {
        if (res.data && res.status === "success") {
          setDerivedCategories(res.data.data);
        } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
          notify(
            res.data.errors[0].field
              ? `${res.data.errors[0].field} ${res.data.errors[0].message}`
              : `${res.data.errors[0].message}`,
            "error",
            TIMEOUT,
          );
        }
      },
      onFailure: (error) => {
        notify(`Error: ${error.message}`, "error", TIMEOUT);
      },
    },
  );

  const { loading } = useQueryWithStore(
    {
      type: "getOne",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/configurations`,
      payload: { categoryId: id },
    },
    {
      onSuccess: (res) => {
        if (res.data && res.status === "success") {
          const parsedResponse = res.data ? getParsedData(res.data) : {};
          setBackUpData({ ...parsedResponse });
          updateEditObj({ ...parsedResponse });
        } else if (res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
          notify(
            res.data.errors[0].field
              ? `${res.data.errors[0].field} ${res.data.errors[0].message}`
              : `${res.data.errors[0].message}`,
            "error",
            TIMEOUT,
          );
        }
      },
      onFailure: (error) => {
        notify(`Error: ${error.message}`, "error", TIMEOUT);
      },
    },
  );

  /**
   * handle change event for radio group values
   *
   * @param {*} value value of selected radio group option
   * @param {*} name of radio group
   */
  const handleChange = useCallback(
    (value, name) => {
      updateEditObj({
        ...editObj,
        [name]: value,
      });
    },
    [editObj],
  );

  /**
   * handle change event for checkboxes group
   *
   * @param {*} e for event
   */
  const handleCheckboxUpdate = useCallback(
    (e) => {
      updateEditObj({
        ...editObj,
        [e.target.name]: e.target.checked,
      });
    },
    [editObj],
  );

  /**
   * handle change event for Category Type Checkbox
   *
   * @param {*} e for event
   */
  const handleCategoryTypeUpdate = useCallback(
    (e) => {
      if (e.target.checked === true) {
        updateEditObj({
          ...editObj,
          "is-derived": false,
          "is-base": false,
          "inherit-auto-sequencing": false,
          "inherit-auto-sequencing-override": false,
          "inherit-dynamic-product-mapping": false,
          "inherit-feature-display": false,
          "inherit-feature-sequence": false,
          "inherit-in-search": false,
          "inherit-is-feature-in-search": false,
          "inherit-is-searchable": false,
          "inherit-manual-product-mapping": false,
          "inherit-sequencing-product-from-base": false,
          [e.target.name]: e.target.checked,
        });
      } else {
        updateEditObj({
          ...editObj,
          "is-derived": backupData["is-derived"],
          "is-base": backupData["is-base"],
          "inherit-auto-sequencing": backupData["inherit-auto-sequencing"],
          "inherit-auto-sequencing-override": backupData["inherit-auto-sequencing-override"],
          "inherit-dynamic-product-mapping": backupData["inherit-dynamic-product-mapping"],
          "inherit-feature-display": backupData["inherit-feature-display"],
          "inherit-feature-sequence": backupData["inherit-feature-sequence"],
          "inherit-in-search": backupData["inherit-in-search"],
          "inherit-is-feature-in-search": backupData["inherit-is-feature-in-search"],
          "inherit-is-searchable": backupData["inherit-is-searchable"],
          "inherit-manual-product-mapping": backupData["inherit-manual-product-mapping"],
          "inherit-sequencing-product-from-base": backupData["inherit-sequencing-product-from-base"],
          [e.target.name]: e.target.checked,
        });
      }
    },
    [editObj, backupData],
  );

  /**
   *@function dialogContent to display confirm messages or derived categories list
   *@param {string } message to display to the user
   *@param {boolean } categorySelection check whether to display derived categories list
   *@returns {React.createElement} returns dialog content with message or derived category list
   */
  const dialogContent = (message, categorySelection) => {
    return (
      <DialogContent>
        <DialogContentText className={classes.dialogContentStyle}>
          {message}
          {categorySelection ? (
            <DerivedCategoryList derivedCategories={derivedCategories} getSelectedCategories={setSelectedCategories} />
          ) : null}
        </DialogContentText>
      </DialogContent>
    );
  };

  /**
   *@function showPopup opens dialog
   *@param {string } action parameter for continue
   *@param {string } categorySelection check to display derived categories popup
   */
  const showPopup = (action, categorySelection) => {
    let message = "";
    if (action === "Continue" && categorySelection) {
      message = translate("select_derived_categories");
    } else {
      message = `${translate("update_message")} ${translate("configurations")}`;
      setStatusFlag(true);
    }
    const dialogObject = {
      dialogContent: dialogContent(message, categorySelection),
      showButtons: true,
      closeText: "Cancel",
      actionText: action,
    };
    setConfirmDialog(dialogObject);
    setIsOpen(true);
  };

  /**
   *
   * @function updateCategoryHandler form request object for category configuration details and make edit api call
   * @param {Array} checkedItems state passed from child component derivedCategories having list of selected categories
   */
  const updateCategoryHandler = (checkedItems) => {
    setSelectedCategories(checkedItems);
    let checkedCategories = [];
    if (selectedCategories.length > 0) {
      checkedCategories = selectedCategories.filter((item) => item.checked);
      checkedCategories = checkedCategories.map((item) => item.categoryId);
    }

    const updateConfigObj = {
      comment: "some dummy comment",
      configSearch: {
        isIncludeInSearchDropdown: {
          inheritedValueFromBase: editObj["inherit-in-search"],
          value: editObj["in-search"],
        },
        isSearchable: {
          inheritedValueFromBase: editObj["inherit-is-searchable"],
          value: editObj["is-searchable"],
        },
      },
      configSequence: {
        isDynamic: {
          inheritedValueFromBase: editObj["inherit-auto-sequencing"],
          value: editObj["auto-sequencing"],
        },
        isManualOverride: {
          inheritedValueFromBase: editObj["inherit-auto-sequencing-override"],
          value: editObj["auto-sequencing-override"],
        },
      },
      templateType: editObj["is-microsite-plp"],
      contextSearch: {
        featureDisplayName: {
          inheritedValueFromBase: editObj["inherit-feature-display"],
          value: editObj["feature-display"],
        },
        featureSearchSequence: {
          inheritedValueFromBase: editObj["inherit-feature-sequence"],
          value: editObj["feature-sequence"],
        },
        isFeatureInSearch: {
          inheritedValueFromBase: editObj["inherit-is-feature-in-search"],
          value: editObj["is-feature-in-search"],
        },
      },
      inheritSequencingAndProductFromBase: {
        inheritedValueFromBase: editObj["inherit-sequencing-product-from-base"],
        value: editObj["sequencing-product-from-base"],
      },
      isIncludeInSitemap: editObj["site-map"],
      isIndependent: editObj["is-independent"],
      productMapping: {
        isDynamic: {
          inheritedValueFromBase: editObj["inherit-dynamic-product-mapping"],
          value: editObj["dynamic-product-mapping"],
        },
        isManualOverride: {
          inheritedValueFromBase: editObj["inherit-manual-product-mapping"],
          value: editObj["manual-product-mapping"],
        },
      },
      propagationChildCategories: checkedCategories,
    };

    dataProvider.update(
      `${window.REACT_APP_GALLERIA_SERVICE}/categories/configurations`,
      {
        data: updateConfigObj,
        id: {
          categoryId: id,
        },
      },
      null,
      {
        onSuccess: (response) => {
          if (response.data && response.status === "success") {
            notify(response.data.message || translate("update_configuration_message"));
            setIsOpen(false);
            setEditable(false);
            refresh();
          } else if (response.data.errors && response.data.errors[0] && response.data.errors[0].message) {
            setIsOpen(false);
            notify(
              response.data.errors[0].field
                ? `${response.data.errors[0].field} ${response.data.errors[0].message}`
                : `${response.data.errors[0].message}`,
              "error",
              TIMEOUT,
            );
          } else if (response.data.error) {
            setIsOpen(false);
            notify(response.data.error, "error", TIMEOUT);
          }
        },
        onFailure: (error) => notify(`Error: ${error.message}`, "error", TIMEOUT),
      },
    );
  };

  /**
   * reset handler
   */
  const handleReset = () => {
    setEditable(false);
    updateEditObj(backupData);
  };
  /**
   *@function categorySelectHandler
   *@param {Array} checkedItems state passed from child component derivedCategories
   *@returns {React.createElement} returns derived categories dialog only if it is base category else sends confirmation dialog and calls update
   */
  const categorySelectHandler = (checkedItems) => {
    return editObj["is-base"] && statusFlag
      ? (showPopup("Continue", editObj["is-base"]), setStatusFlag(false))
      : updateCategoryHandler(checkedItems);
  };

  const formattedResponseData = editObj || {};
  /**
   * @function updateConfig function to open
   * @param {object} editData object containing updated data for configuration
   */
  const updateConfig = (editData) => {
    showPopup("Continue", false);
    updateEditObj({ ...editObj, ...editData });
  };
  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <CategoryConfigView
          formattedResponseData={formattedResponseData}
          editObj={editObj}
          radioGroupOptions={radioGroupOptions}
          handleChange={handleChange}
          handleCheckboxUpdate={handleCheckboxUpdate}
          handleReset={handleReset}
          showPopup={showPopup}
          editable={editable}
          setEditable={setEditable}
          backupData={backupData}
          handleCategoryTypeUpdate={handleCategoryTypeUpdate}
          loading={loading}
          updateConfiguration={updateConfig}
        />
      )}
      <SimpleModel
        {...confirmDialogObj}
        openModal={isOpen}
        handleClose={() => setIsOpen(false)}
        handleAction={categorySelectHandler}
      />
    </>
  );
};

CategoryConfiguration.propTypes = {
  resource: PropTypes.string,
  id: PropTypes.string.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

CategoryConfiguration.defaultProps = {
  resource: "",
};

export default CategoryConfiguration;
