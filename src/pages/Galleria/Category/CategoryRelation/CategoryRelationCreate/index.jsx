/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useCallback } from "react";
import {
  useTranslate,
  SimpleForm,
  SelectInput,
  NumberInput,
  DateInput,
  required,
  Toolbar,
  Button,
  useRedirect,
  useNotify,
  useCreate,
  useQueryWithStore,
  SaveButton,
} from "react-admin";
import PropTypes from "prop-types";
import { Typography, Grid, DialogContent, DialogContentText } from "@material-ui/core";
import useStyles from "../../../../../assets/theme/common";
import SimpleModel from "../../../../../components/CreateModal";
import AutoComplete from "../../../../../components/AutoComplete";
import { getFormattedTimeValue } from "../../../../../utils/formatDateTime";
import SwitchComp from "../../../../../components/switch";
import GenericRadioGroup from "../../../../../components/RadioGroup";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import { minValue } from "../../../../../utils/validationFunction";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

const requiredValidate = [required()];

/**
 * Component to create a relation between the current selected Category to another Category
 *
 * @param {*} props all the props required by Category Relation Create component
 * @returns {React.ReactElement} returns Create Category Relation Create component
 */
const CategoryRelationCreate = (props) => {
  const { match } = props;
  const categoryId = match.params.id;
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();
  const [relationTypes, setRelationTypes] = useState([]);
  const [confirmDialogObj, setConfirmDialog] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [createRelationObj, updateCreateRelationObj] = useState({
    targetCategoryId: {},
    associationType: "",
    isPrimary: false,
    sequence: null,
    fromDate: null,
    thruDate: null,
  });
  const selectedCategoryId = localStorage.getItem("selectedCategoryId");
  const breadcrumbs = [
    {
      displayName: translate("category_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    },
    {
      displayName: selectedCategoryId,
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${selectedCategoryId}/show`,
    },
    {
      displayName: translate("category_relation"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${selectedCategoryId}/show/relationship`,
    },
    { displayName: translate("new_relation") },
  ];
  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/association-types`,
      payload: {},
    },
    {
      onSuccess: (res) => {
        const relationTypeValue = [];
        if (res.data?.data && res.status === "success") {
          res.data.data?.forEach((data) => {
            relationTypeValue.push({ id: data.id, name: data.associationTypeName });
          });
          setRelationTypes(relationTypeValue);
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

  /**
   * @function cancelTagHandler function called on click of cancel button of Create Relation Page
   * @param {*} event event called on click of cancel
   */
  const cancelTagHandler = useCallback(
    (event) => {
      event.preventDefault();
      redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${selectedCategoryId}/show/relationship`);
    },
    [redirect, selectedCategoryId],
  );

  const [createCategoryRelation] = useCreate(
    `${window.REACT_APP_GALLERIA_SERVICE}/categories/associations`,
    {
      dataObj: JSON.stringify({
        associationType: createRelationObj.associationType.id,
        targetCategoryId: !createRelationObj.targetCategoryId
          ? createRelationObj.targetCategoryId
          : createRelationObj.targetCategoryId.id,
        isPrimary: createRelationObj.isPrimary,
        fromDate: createRelationObj.fromDate,
        thruDate: createRelationObj.thruDate,
        sequence: createRelationObj.sequence,
      }),

      params: {
        categoryId,
      },
    },
    {
      onSuccess: (res) => {
        if (res.data && res.status === "success") {
          redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories/${categoryId}/show/relationship`);
          notify(res.data.message || translate("create_association_success_message"));
          setIsOpen(false);
        } else {
          setIsOpen(false);
          notify(res.message || translate("create_association_error_message"), "error", TIMEOUT);
        }
      },
      onFailure: (error) => notify(`Error: ${error.message}`, "error", TIMEOUT),
    },
  );
  /**
   * @function dialogContent renders a Confirmation Dialog that opens on click of Create button
   * @param {string } message message to be displayed in the confirmation modal
   * @returns {React.createElement} returns Confirmation Dialog
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };
  /**
   * @function createHandler function called on click of create button on Create Page
   * @param {string } action name of the action
   */
  const showPopup = (action) => {
    if (createRelationObj.targetCategoryId === null || Object.keys(createRelationObj.targetCategoryId).length === 0) {
      setErrorMsg(true);
      return;
    }
    const message = translate("create_confirmation_message");
    const dialogObject = {
      dialogContent: dialogContent(message),
      showButtons: true,
      closeText: "Cancel",
      actionText: action,
    };
    setConfirmDialog(dialogObject);
    setIsOpen(true);
  };

  /**
   * CustomToolbar for Category Relation Create component
   *
   * @param {*} customProps all the customProps required by Customtool bar
   * @returns {React.ReactElement} CustomToolbar of Category Relation Create component
   */
  const CustomToolbar = (customProps) => {
    return (
      <Toolbar {...customProps}>
        <Button variant="outlined" label={translate("cancel")} onClick={cancelTagHandler} />
        <SaveButton variant="contained" label={translate("create")} icon={<></>} />
      </Toolbar>
    );
  };
  const primary = [
    { id: true, name: "Yes" },
    { id: false, name: "No" },
  ];

  /**
   *@function updateFormData function called on click of create
   *@param {*} createObj event called on create
   */
  const updateFormData = (createObj) => {
    const updatedCreateObj = {
      sequence: createObj.sequence,
      associationType: createObj.associationType,
      isPrimary: createObj.isPrimary,
    };
    showPopup("Continue");
    updateCreateRelationObj({ ...createRelationObj, ...updatedCreateObj });
  };
  /**
   * @function updateCategoryName function that updates the changed value of Category name dropdown
   * @param {string} event value of selected category name
   * @param {string} newValue value key
   */
  const updateCategoryName = useCallback(
    (event, newValue) => {
      const categoryNameObj = newValue;
      updateCreateRelationObj({ ...createRelationObj, targetCategoryId: categoryNameObj });
      setErrorMsg(false);
    },
    [createRelationObj],
  );
  /**
   *@function handleFromDateChange function called on change of From date in create relation page
   *@param {string} event event called on change of From date
   */
  const handleFromDateChange = useCallback(
    (event) => {
      updateCreateRelationObj({
        ...createRelationObj,
        fromDate: event.target.value.concat("T", getFormattedTimeValue()),
      });
    },
    [createRelationObj],
  );
  /**
   *@function handleThruDateChange function called on change of To date in create relation page
   *@param {string} event event called on change of To date
   */
  const handleThruDateChange = useCallback(
    (event) => {
      updateCreateRelationObj({
        ...createRelationObj,
        thruDate: event.target.value.concat("T", getFormattedTimeValue()),
      });
    },
    [createRelationObj],
  );

  const apiParams = {
    fieldName: "categoryName",
    type: "getData",
    url: `${window.REACT_APP_GALLERIA_SERVICE}/category-names`,
    sortParam: "categoryName",
    fieldId: "categoryId",
  };
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleForm save={updateFormData} toolbar={<CustomToolbar />}>
        <Grid item className={classes.titleGridStyle}>
          <Typography variant="subtitle1" className={classes.marginTopNone}>
            {translate("new_relation")}
          </Typography>
          <SwitchComp record={false} disable />
        </Grid>

        <Grid item container direction="row" alignItems="flex-start" justify="space-between" md={9}>
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <Typography variant="caption">{translate("category_id")}</Typography>
            <Typography variant="subtitle2">{selectedCategoryId}</Typography>
          </Grid>
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <AutoComplete
              label="Category Name"
              dataId="categoryRelationName"
              apiParams={apiParams}
              onOpen
              value={createRelationObj.targetCategoryId}
              autoCompleteClass={classes.autoCompleteItem}
              onChange={(e, newValue) => {
                const newVal = newValue === null ? {} : newValue;
                updateCategoryName(e, newVal);
              }}
              required
              errorMsg={errorMsg}
            />
          </Grid>
          <Grid
            item
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
            xs
            className={classes.relationShipType}
          >
            <SelectInput
              source="associationType.id"
              choices={relationTypes}
              validate={requiredValidate}
              label={translate("relation_type")}
              className={classes.autoCompleteItem}
              data-at-id="relation_type"
              value={createRelationObj.associationType}
            />
          </Grid>
        </Grid>
        <Grid item container justify="space-evenly" alignItems="center" md={6}>
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <GenericRadioGroup
              label={translate("primary")}
              source="isPrimary"
              choices={primary}
              defaultValue={createRelationObj.isPrimary}
              editable
            />
          </Grid>
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <NumberInput
              source="sequence"
              className={classes.sequence}
              label={translate("sequence")}
              data-at-id="sequence"
              autoComplete="off"
              min={1}
              type="tel"
              value={createRelationObj.sequence}
            />
          </Grid>
        </Grid>
        <Grid item direction="row" alignItems="flex-start" justify="space-between" container md={6}>
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <DateInput
              source="fromDate"
              label={translate("from_date")}
              className={classes.dateField}
              data-at-id="relationFromDate"
              onChange={handleFromDateChange}
            />
          </Grid>
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <DateInput
              source="thruDate"
              label={translate("to_date")}
              className={classes.dateField}
              data-at-id="relationToDate"
              onChange={handleThruDateChange}
              validate={minValue(createRelationObj.fromDate, translate("to_date_validation_message"))}
            />
          </Grid>
        </Grid>
      </SimpleForm>
      <SimpleModel
        {...confirmDialogObj}
        openModal={isOpen}
        handleClose={() => setIsOpen(false)}
        handleAction={createCategoryRelation}
      />
    </>
  );
};
CategoryRelationCreate.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
};
CategoryRelationCreate.defaultProps = {
  match: {},
};
export default React.memo(CategoryRelationCreate);
