/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslate, useNotify, useDataProvider, useQueryWithStore, useRefresh } from "react-admin";
import { DialogContent, DialogContentText } from "@material-ui/core";
import SimpleModel from "../../../../../components/CreateModal";
import SeoDetailsUI from "./SeoDetailsUI";
import LoaderComponent from "../../../../../components/LoaderComponent";
import { TIMEOUT } from "../../../../../config/GlobalConfig";

/**
 * Component for Category SEO Details
 *
 * @param {*} props all the props needed for SEO Details
 * @returns {React.ReactElement} returns a SEO Details component
 */
const SeoDetails = (props) => {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { id } = props;
  const translate = useTranslate();
  const refresh = useRefresh();
  const [editMode, setEditMode] = useState(false);
  const [confirmDialogObj, setConfirmDialog] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [seoObj, updateSeoObj] = useState({});
  const [relData, setRelData] = useState([]);
  const [relAltUpdatedData, setRelAltUpdatedData] = useState([]);
  const canonicalOptions = [
    { id: "SELF", name: "SELF" },
    { id: "REFERENCE", name: "REFERENCE" },
  ];
  const { loading } = useQueryWithStore(
    {
      type: "getOne",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/seo`,
      payload: { categoryId: id },
    },
    {
      onSuccess: (res) => {
        if (res.data && res.status === "success") {
          updateSeoObj(res.data);
          setRelAltUpdatedData(res.data.relAltAssociations);
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
  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/seo/rel-alt`,
      payload: { categoryId: id },
    },
    {
      onSuccess: (res) => {
        const hrefValue = [];
        if (res.data?.data && res.status === "success") {
          res.data.data.forEach((data) => {
            hrefValue.push({ id: data.hrefLang, name: data.hrefLang });
          });
        } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
          notify(res.data.errors[0].message, "error", TIMEOUT);
        }
        setRelData(hrefValue);
      },
      onFailure: (error) => {
        notify(`Error: ${error.message}`, "error", TIMEOUT);
      },
    },
  );

  /**
   * @function editSeoHandler function called on click of edit button
   * @returns {object} history object
   */
  const editSeoHandler = () => setEditMode(true);

  /**
   * @param {*} message message to be displayed in the confirmation dialog
   * @returns {React.createElement} dialogContent confirmation dialogs
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   * @param {*} action String inside dialogsContent
   * @function showPopup
   */
  const showPopup = (action) => {
    let message = "";
    message = `${translate("update_message")} ${translate("seo_details")}`;

    const dialogObject = {
      dialogContent: dialogContent(message),
      showButtons: true,
      closeText: translate("cancel"),
      actionText: action,
    };
    setConfirmDialog(dialogObject);
    setIsOpen(true);
  };

  /**
   * @function updateSeoHandler function called on click of Update button
   */
  const updateSeoHandler = () => {
    updateSeoObj({
      canonical: {
        type: seoObj.canonical ? seoObj.canonical.type : null,
        url: seoObj.canonical ? seoObj.canonical.url : null,
      },
      relAltAssociations: [...seoObj.relAltAssociations],
    });
    setIsOpen(false);
    dataProvider
      .put(`${window.REACT_APP_GALLERIA_SERVICE}/categories/seo`, {
        data: JSON.stringify(seoObj),
        id: { categoryId: props.id },
      })
      .then((response) => {
        if (response.data && response.status === "success") {
          setEditMode(false);
          notify(response.data.message || translate("success_msg"));
        } else if (
          (response.data.errors && response.data.errors[0].errorCode && response.data.errors[0].message,
          "error",
          TIMEOUT)
        ) {
          setIsOpen(false);
          notify(response.data.errors[0].message, "error", TIMEOUT);
        }
      });
  };

  /**
   * @function cancelHandler function called on click of cancel button
   */
  const cancelHandler = useCallback(() => {
    setEditMode(false);
    setIsOpen(false);
    refresh();
  }, [refresh]);

  /**
   * @function addClick function called on click of add button
   */
  const addClick = useCallback(() => {
    const tempRelAltAssociationsArray = [...relAltUpdatedData];
    tempRelAltAssociationsArray.push({ hrefLang: "", href: "" });
    updateSeoObj({
      ...seoObj,
      relAltAssociations: [...tempRelAltAssociationsArray],
    });
    setRelAltUpdatedData([...tempRelAltAssociationsArray]);
  }, [seoObj, relAltUpdatedData]);

  /**
   *
   * @param {*} index index of the item we are deleting
   * @function deleteClick function called on click of delete button
   */
  const deleteClick = useCallback(
    (index) => {
      const tempRelAltAssociationsArray = [...relAltUpdatedData];
      tempRelAltAssociationsArray.splice(index, 1);
      updateSeoObj({
        ...seoObj,
        relAltAssociations: [...tempRelAltAssociationsArray],
      });
      setRelAltUpdatedData([...tempRelAltAssociationsArray]);
    },
    [relAltUpdatedData, seoObj],
  );

  /**
   *
   * @param {*} event event
   * @param {number} index index of the select input element that is changed
   * @function handleSelectInputChange function called on change of the rel Alt select input
   */
  const handleSelectInputChange = useCallback(
    (event, index) => {
      relAltUpdatedData[index].hrefLang = event.target.value;
      updateSeoObj({
        ...seoObj,
        relAltAssociations: [...relAltUpdatedData],
      });
    },
    [relAltUpdatedData, seoObj],
  );

  /**
   *
   * @param {*} event event
   * @param {number} index index of the text input element that is changed
   * @function handleTextInputChange function called on change of the rel Alt text input
   */
  const handleTextInputChange = useCallback(
    (event, index) => {
      relAltUpdatedData[index].href = event.target.value;
      updateSeoObj({
        ...seoObj,
        relAltAssociations: [...relAltUpdatedData],
      });
    },
    [relAltUpdatedData, seoObj],
  );

  /**
   * @function addUpdateHandler
   * @returns {React.createElement} update the seo or continue
   */
  const addUpdateHandler = () => showPopup("Continue");

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <SeoDetailsUI
          editMode={editMode}
          relData={relData}
          canonicalOptions={canonicalOptions}
          editSeoHandler={editSeoHandler}
          addUpdateHandler={addUpdateHandler}
          handleTextInputChange={handleTextInputChange}
          handleSelectInputChange={handleSelectInputChange}
          deleteClick={deleteClick}
          addClick={addClick}
          cancelHandler={cancelHandler}
          relAltUpdatedData={relAltUpdatedData}
          seoObj={seoObj}
          loading={loading}
        />
      )}
      <SimpleModel
        {...confirmDialogObj}
        openModal={isOpen}
        handleClose={() => setIsOpen(false)}
        handleAction={updateSeoHandler}
      />
    </>
  );
};

SeoDetails.propTypes = {
  id: PropTypes.string.isRequired,
};
export default SeoDetails;
