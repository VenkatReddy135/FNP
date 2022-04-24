/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from "react";
import { useNotify, useTranslate, useMutation, useRedirect } from "react-admin";
import { DialogContent, DialogContentText } from "@material-ui/core";
import PropTypes from "prop-types";
import useStyles from "../../../../../assets/theme/common";
import LoaderComponent from "../../../../../components/LoaderComponent";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../../utils/CustomHooks";
import SimpleModel from "../../../../../components/CreateModal";
import CommonDelete from "../../../../../components/CommonDelete";
import CustomCheckboxArray from "../../../../../components/CustomCheckbox";
import { TformattedDateConverter } from "../../../../../utils/formatDateTime";
import CategoryViewUI from "./CategoryViewUI";

/**
 * Component for View Category Details containing generic tabs
 *
 * @param {*} props params of Category Details component
 * @returns {React.ReactElement} returns parent component for category tabular details
 */
const CategoryView = (props) => {
  const { id, isEditable, setEnableFuncGC, enableValGC, setWorkFlowStateGC } = props;
  const record = id;
  const classes = useStyles();
  const [openModal, toggleModal] = useState(false);
  const [categoryObj, updateCategoryObj] = useState([]);
  const [checkedState, setCheckedState] = useState({
    inheritCheckboxName: false,
    inheritCheckboxType: false,
  });
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [derivedCategories, setDerivedCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogObj, setConfirmDialog] = useState({});
  const [datatoSent, setDatatoSent] = useState({});
  const [mutate, { loading: mutateLoading }] = useMutation();
  const notify = useNotify();
  const translate = useTranslate();
  const redirect = useRedirect();
  const { inheritCheckboxName, inheritCheckboxType } = checkedState;

  const baseURL = `/${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}`;

  /**
   * @function toggleClose function passed to property handleClose of SimpleModal.
   *
   */
  const toggleClose = () => {
    toggleModal(false);
  };

  /**
   * @function handleSuccess This function will run on success of create tag
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    localStorage.setItem("selectedCategoryId", res?.data?.id);
    updateCategoryObj({
      ...res?.data,
      categoryTypeName: res?.data?.categoryType?.value?.id,
      categoryTypeNameShow: res?.data?.categoryType?.value?.categoryTypeName,
    });
    setEnableFuncGC(res?.data?.isEnabled);
    setWorkFlowStateGC(res?.data?.workflowStatus);
    setCheckedState({
      inheritCheckboxName: res?.data?.categoryName?.inheritedValueFromBase || false,
      inheritCheckboxType: res?.data?.categoryType?.inheritedValueFromBase || false,
    });
  };

  const categoryResource = `${window.REACT_APP_GALLERIA_SERVICE}/categories/${record}`;
  const { loading } = useCustomQueryWithStore("getOne", categoryResource, handleSuccess);

  /**
   *@function checkTimeModification check if from & thru date are modified
   *
   *@param {string} pickerValue time picker value
   *@param {string} responseValue response from api
   *@returns {string} date
   */
  const checkTimeModification = (pickerValue, responseValue) => {
    if (!responseValue && !pickerValue) {
      return null;
    }
    if (responseValue && responseValue.split("T")[0] === pickerValue) {
      return responseValue;
    }
    return TformattedDateConverter(pickerValue);
  };

  /**
   *@function dataBuilder Function will use to create the update data
   *@param {event} evnt event contains
   */
  const dataBuilder = (evnt) => {
    setDatatoSent({
      categoryName: {
        inheritedValueFromBase: inheritCheckboxName,
        value: evnt.categoryName.value,
      },
      categoryType: { inheritedValueFromBase: inheritCheckboxType, value: evnt.categoryTypeName },
      categoryUrl: evnt.URL,
      comment: evnt.comment,
      fromDate: checkTimeModification(evnt.fromDate, categoryObj.fromDate),
      isEnabled: enableValGC,
      thruDate: checkTimeModification(evnt.thruDate, categoryObj.thruDate),
      propagationChildCategories: [],
    });
  };

  /**
   *@function checkBoxChangeFunc Function will run on changing the derived category checkboxes
   *@param {object} data contains the CONTINUE/CONFIRM etx
   */
  const checkBoxChangeFunc = (data) => {
    const selctedDerivedCategory = [];
    data.forEach((datum) => {
      if (datum.checked) {
        selctedDerivedCategory.push(datum.value);
      }
    });
    setDatatoSent((prevState) => ({ ...prevState, propagationChildCategories: selctedDerivedCategory }));
  };
  /**
   *@function dialogContent Function will use to create the dialogue content
   *@param {string} message contains the CONTINUE/CONFIRM etx
   *@param {boolean} flag contains the CONTINUE/CONFIRM etx
   * @returns {React.Component} return  Component
   */
  const dialogContent = (message, flag) => {
    return (
      <DialogContent className={classes.contentStyle}>
        <DialogContentText className={classes.dialogContentStyle}>{message}</DialogContentText>
        {flag && (
          <CustomCheckboxArray checkboxList={derivedCategories} onChange={checkBoxChangeFunc} checkAllButton label="" />
        )}
      </DialogContent>
    );
  };

  /**
   *@function showPopup Function will use to show confirm/select derived list
   *@param {string} action contains the CONTINUE/CONFIRM etx
   */
  const showPopup = (action) => {
    toggleModal(true);
    let dialogObject = {};
    switch (action) {
      case "CONTINUE":
        dialogObject = {
          dialogContent: dialogContent(translate("update_msg_category")),
          showButtons: true,
          closeText: translate("cancel"),
          actionText: translate("continue"),
        };
        break;
      default:
        dialogObject = {
          dialogContent: dialogContent(translate("select_derived_category"), true),
          showButtons: true,
          closeText: translate("cancel"),
          actionText: translate("ok"),
        };
    }
    setConfirmDialog(dialogObject);
  };

  /**
   *@function onUpdateHandler Function will use when click on update button
   *@param {event} event event called on change of From date
   */
  const onUpdateHandler = (event) => {
    showPopup("CONTINUE");
    dataBuilder(event);
  };

  /**
   *@function cancelTagHandler Function will use to close the popup
   */
  const cancelTagHandler = () => {
    redirect(`${baseURL}/show`);
  };

  /**
   *@function handleSuccessFunc Function will use to create the dialogue content
   *@param {object} response contains response data
   */
  const handleSuccessFunc = (response) => {
    notify(response.data.message, "info", TIMEOUT);
    redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories`);
  };

  /**
   *@function transportationFunc Function will use to send data through data provider
   */
  const transportationFunc = () => {
    mutate(
      {
        type: "update",
        resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/${record}`,
        payload: {
          data: datatoSent,
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleSuccessFunc });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  /**
   *@function updateFunc Function will use to create the dialogue content
   */
  const updateFunc = () => {
    if (derivedCategories.length === 0) {
      toggleModal(false);
      transportationFunc();
    } else {
      showPopup("CONFIRM");
    }
  };

  /**
   *@function updateDataFunc Function will use to create the dialogue content
   */
  const updateDataFunc = () => {
    toggleModal(false);
    transportationFunc();
  };

  /**
   *@function updateCheckbox callback for category name check/unchecked
   *@param {event} event contains synthetic events
   */
  const updateCheckbox = (event) => {
    const { name, checked } = event.target;
    setCheckedState((prev) => {
      return { ...prev, [name]: checked };
    });
  };

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    const categoryType = res?.data?.data?.map(({ id: categoryTypeId, categoryTypeName }) => {
      return { id: categoryTypeId, name: categoryTypeName };
    });
    setCategoryTypes(categoryType);
  };

  /**
   *@function onSuccessCallback it is a callback on success
   *@param {object} res contains the CONTINUE/CONFIRM etx
   */
  const onSuccessCallback = (res) => {
    setDerivedCategories(res.data?.data);
  };

  const resource = `${window.REACT_APP_GALLERIA_SERVICE}/category-types`;
  useCustomQueryWithStore("getData", resource, handleSetDataSuccess);

  const URL = `${window.REACT_APP_GALLERIA_SERVICE}/categories/${record}/derived-categories`;
  useCustomQueryWithStore("getData", URL, onSuccessCallback);

  /**
   *@function deleteHandler Function will use to open commonDelete popup
   */
  const deleteHandler = () => {
    setOpenDialog(true);
  };

  /**
   *@function handleEditable Function will use switch between edit and view screen
   */
  const handleEditable = () => {
    redirect(`${baseURL}/edit`);
  };

  /**
   *@function handleContinueAction Function to confirm the update
   *@returns {Function} action to perform onClick
   */
  const handleContinueAction = () => {
    return dialogObj.actionText === "ok" ? updateDataFunc() : updateFunc();
  };

  return (
    <>
      {loading || mutateLoading ? (
        <LoaderComponent />
      ) : (
        <>
          <CategoryViewUI
            categoryObj={categoryObj}
            deleteHandler={deleteHandler}
            updateCheckbox={updateCheckbox}
            cancelTagHandler={cancelTagHandler}
            onUpdateHandler={onUpdateHandler}
            editable={isEditable}
            categoryTypes={categoryTypes}
            checkedState={checkedState}
            handleEditable={handleEditable}
          />
          <SimpleModel
            {...dialogObj}
            showButtons
            closeText={translate("cancel")}
            actionText={translate("continue")}
            openModal={openModal}
            handleClose={toggleClose}
            handleAction={handleContinueAction}
          />

          <CommonDelete
            resource={`${window.REACT_APP_GALLERIA_SERVICE}/categories/${record}`}
            redirectPath={`${window.REACT_APP_GALLERIA_SERVICE}/categories`}
            params={{}}
            close={() => setOpenDialog(false)}
            open={openDialog}
            deleteText={`${translate("delete_confirmation_message")} ${translate("category")}?`}
          />
        </>
      )}
    </>
  );
};

CategoryView.propTypes = {
  id: PropTypes.string.isRequired,
  enableVal: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
  enableValue: PropTypes.bool.isRequired,
  setEnableFuncGC: PropTypes.func.isRequired,
  enableValGC: PropTypes.bool.isRequired,
  setWorkFlowStateGC: PropTypes.func.isRequired,
};

export default React.memo(CategoryView);
