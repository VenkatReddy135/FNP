/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  useTranslate,
  SimpleForm,
  SelectInput,
  NumberInput,
  required,
  useRedirect,
  useNotify,
  useCreate,
} from "react-admin";
import { Typography, Grid, Divider } from "@material-ui/core";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import useStyles from "../../../../../assets/theme/common";
import SimpleModel from "../../../../../components/CreateModal";
import AutoComplete from "../../../../../components/AutoComplete";
import SwitchComp from "../../../../../components/switch";
import { onSuccess, onFailure } from "../../../../../utils/CustomHooks/HelperFunctions";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import CommonDialogContent from "../../../../../components/CommonDialogContent";
import CustomToolbar from "../../../../../components/CustomToolbar";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

const requiredValidate = [required()];

/**
 * Component to create a relation between the current selected Tag to another Tag
 *
 * @param {*} props all the props required by Tag Relation Create component
 * @returns {React.ReactElement} returns Create Tag Relation Create component
 */
const TagRelationCreate = (props) => {
  const { match } = props;
  const { id: tagId } = match.params;
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();

  const [relationType, setRelationType] = useState([]);
  const [confirmDialogObj, setConfirmDialog] = useState({});

  const [flag, setFlag] = useState({
    isOpen: false,
    errorMsg: false,
  });
  const { isOpen, errorMsg } = flag;

  const [createRelationObj, updateCreateRelationObj] = useState({
    relationTypeId: "",
    targetTagId: {},
    sequence: null,
  });

  const { relationTypeId, targetTagId, sequence } = createRelationObj;

  const baseURL = `${window.REACT_APP_GALLERIA_SERVICE}/tags/${tagId}/show/relations`;
  const breadcrumbs = [
    {
      displayName: translate("tag_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags`,
    },
    { displayName: tagId, navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags/${tagId}/show` },
    {
      displayName: translate("tag_relations_and_associations"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags/${tagId}/show/relations`,
    },
    { displayName: translate("new_tag_relation") },
  ];

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    const relationTypes = res?.data?.data?.map(({ id, name }) => {
      return { id, name };
    });
    setRelationType(relationTypes);
  };

  const resource = `${window.REACT_APP_GALLERIA_SERVICE}/tags/relation-types`;
  useCustomQueryWithStore("getData", resource, handleSetDataSuccess);

  /**
   * @function cancelTagHandler function called on click of cancel button of Create Relation Page
   * @param {*} event event called on click of cancel
   */
  const cancelTagHandler = (event) => {
    event.preventDefault();
    redirect(`/${baseURL}`);
  };

  /**
   * @function handleSuccess This function will run on success of create tag
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    redirect(`/${baseURL}`);
    notify(res?.data?.message || translate("create_tag_relation_success_message"), "info", TIMEOUT);
    setFlag((prevState) => ({ ...prevState, isOpen: false }));
  };

  /**
   * @function handleBadRequest This function will run on success of create tag
   * @param {object} res is passed to the function
   */
  const handleBadRequest = (res) => {
    setFlag((prevState) => ({ ...prevState, isOpen: false }));
    notify(res?.message || translate("create_tag_relation_error_message"), "error", TIMEOUT);
  };

  const [createTagRelation] = useCreate(
    `${window.REACT_APP_GALLERIA_SERVICE}/tags/${tagId}/relations`,
    {
      dataObj: JSON.stringify({
        isEnabled: true,
        relationTypeId,
        targetTagId: targetTagId.id || targetTagId,
        sequence,
      }),
    },
    {
      onSuccess: (response) => {
        onSuccess({ response, handleSuccess, handleBadRequest });
      },
      onFailure: (error) => {
        onFailure({ error, notify, translate });
      },
    },
  );

  /**
   * @function createHandler function called on click of create button on Create Page
   * @param {string } action name of the action
   */
  const showPopup = (action) => {
    if (targetTagId === null || Object.keys(targetTagId).length === 0) {
      setFlag((prevState) => ({ ...prevState, errorMsg: true }));

      return;
    }
    const message = translate("create_tag_relation_confirmation_message");
    const dialogObject = {
      dialogContent: <CommonDialogContent message={message} />,
      showButtons: true,
      closeText: "Cancel",
      actionText: action,
    };
    setConfirmDialog(dialogObject);
    setFlag((prevState) => ({ ...prevState, isOpen: true }));
  };

  /**
   *@function updateFormData function called on click of create
   *@param {*} createObj event called on create
   */
  const updateFormData = (createObj) => {
    showPopup("Continue");
    updateCreateRelationObj((prevState) => ({ ...prevState, ...createObj }));
  };

  /**
   * @function handleAutocompleteChange function that updates the changed value of Tag name dropdown
   * @param {string} e value of selected Tag name
   * @param {string} newValue value key
   */
  const handleAutocompleteChange = (e, newValue) => {
    const newVal = newValue === null ? {} : newValue;
    updateCreateRelationObj((prevState) => ({ ...prevState, targetTagId: newVal }));
    setFlag((prevState) => ({ ...prevState, errorMsg: false }));
  };

  /**
   * @function handleModelClose function that updates the changed value of Tag name dropdown
   */
  const handleModelClose = () => {
    setFlag((prevState) => ({ ...prevState, isOpen: false }));
  };

  const apiParams = {
    type: "getData",
    url: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
    fieldId: "tagId",
    fieldName: "tagName",
    sortParam: "tagName",
  };
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <SimpleForm
        save={updateFormData}
        toolbar={<CustomToolbar onClickCancel={cancelTagHandler} saveButtonLabel={translate("create")} />}
      >
        <Grid container className={classes.titleGridStyle} alignItems="baseline">
          <Typography variant="subtitle1">{translate("new_tag_relation")}</Typography>
          <Divider orientation="vertical" className={classes.verticalDivider} flexItem />
          <SwitchComp record disable />
        </Grid>
        <Grid container justify="space-between" md={9}>
          <SelectInput
            source="relationTypeId"
            choices={relationType}
            validate={requiredValidate}
            label={translate("relation_type")}
            className={classes.autoCompleteItem}
            data-at-id="relation_type"
            value={relationTypeId}
          />
          <AutoComplete
            label={translate("relation_type_value")}
            data-at-id="relationTypeValue"
            apiParams={apiParams}
            onOpen
            value={targetTagId}
            autoCompleteClass={classes.autoCompleteItem}
            onChange={handleAutocompleteChange}
            required
            errorMsg={errorMsg}
          />
          <NumberInput
            source="sequence"
            className={classes.sequence}
            label={translate("sequence")}
            data-at-id="sequence"
            autoComplete="off"
            min={1}
            type="tel"
            value={sequence}
          />
        </Grid>
      </SimpleForm>
      <SimpleModel
        {...confirmDialogObj}
        openModal={isOpen}
        handleClose={handleModelClose}
        handleAction={createTagRelation}
      />
    </>
  );
};

TagRelationCreate.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
};
TagRelationCreate.defaultProps = {
  match: {},
};

export default TagRelationCreate;
