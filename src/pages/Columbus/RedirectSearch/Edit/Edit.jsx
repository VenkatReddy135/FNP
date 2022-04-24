/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslate, SimpleForm, useRedirect, useNotify, SimpleShowLayout, useMutation } from "react-admin";
import { DialogContent, DialogContentText } from "@material-ui/core";
import SimpleModel from "../../../../components/CreateModal";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import LoaderComponent from "../../../../components/LoaderComponent";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import RedirectEditUI from "./EditUI";
import CustomToolbar from "../../../../components/CustomToolbar";

/**
 * Component to render the Edit Page of Redirect Campaign
 *
 * @param {*} props all the props required by the Redirect Campaign - Edit
 * @returns {React.ReactElement} returns the Edit Page of Redirect Campaign
 */
const RedirectSearchEdit = (props) => {
  const { id, domain, getCampaignName } = props;
  const translate = useTranslate();
  const [editCampaignObj, setEditCampaignObj] = useState({
    campaignName: "",
    geoId: "",
    keyword: [],
    targetUrl: "",
  });
  const [responseData, setResponseData] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({});
  const [editConfirmModal, setEditConfirmModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const redirect = useRedirect();
  const notify = useNotify();
  const [mutate] = useMutation();
  const [geoOptions, setGeoOptions] = useState([]);
  const [campaignDate, setCampaignDate] = useState({
    fromDate: new Date(),
    thruDate: new Date(),
  });
  const [renderDomain, setRenderDomain] = useState(false);

  /**
   * @function handleGeoListSuccess to handle success of the API
   * @param {object} res to set res
   */
  const handleGeoListSuccess = (res) => {
    const geoValues = [];
    if (res.data?.data) {
      res.data.data.forEach((geo) => {
        geoValues.push({ id: geo.geoId, name: geo.geoName });
      });
    }
    setGeoOptions(geoValues);

    if (renderDomain) {
      setResponseData((prevState) => ({ ...prevState, geoId: "" }));
    }
  };

  /**
   * @function handleGeoListFailure to handle failure of the API
   */
  const handleGeoListFailure = () => {
    setGeoOptions([]);
    notify(translate("indexable_attribute.geo_error_message"), "error", TIMEOUT);
  };

  /**
   * API To get list of geo by domain id
   *
   * @name getGeoListAPICall
   */
  const getGeoListAPICall = () => {
    mutate(
      {
        type: "getOne",
        resource: `${window.REACT_APP_GALLERIA_SERVICE}/geographies?domainId=${domain}`,
        payload: {},
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleGeoListSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate, handleFailure: handleGeoListFailure });
        },
      },
    );
  };

  useEffect(() => {
    getGeoListAPICall();
  }, [domain]);

  /**
   * @function handleSuccess to handle success of the API
   * @param {object} res to set res
   */
  const handleSuccess = (res) => {
    const { campaignName, geoId, keywords, targetUrl, fromDate: resFromDate, thruDate: resThruDate } = res.data;
    setResponseData({
      ...res.data,
    });
    setEditCampaignObj({
      campaignName,
      geoId,
      keyword: keywords.split(","),
      targetUrl,
    });
    setCampaignDate({
      fromDate: resFromDate,
      thruDate: resThruDate,
    });
    setRenderDomain(true);
    getCampaignName(campaignName);
  };

  const { loading } = useCustomQueryWithStore(
    "getOne",
    `${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns/${id}`,
    handleSuccess,
    {
      enabled: domain.toLowerCase() !== "",
    },
  );

  /**
   * @function dialogContent function renders the Pop-up according to a condition
   * @param {string } message name of the action
   * @returns {React.createElement} returns a pop-up with action buttons
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   * @function showPopup function renders a confirmation pop-up with action buttons
   *
   */
  const showPopup = () => {
    const dialogObject = {
      dialogContent: dialogContent(translate("redirect_campaign.edit_popup")),
      dialogTitle: "",
      showButtons: true,
      closeText: translate("no_button_label"),
      actionText: translate("yes_button_label"),
    };
    setConfirmDialog(dialogObject);
    setEditConfirmModal(true);
  };

  /**
   * @function handleUpdateSuccess to handle success of the API
   */
  const handleUpdateSuccess = () => {
    notify(translate("redirect_campaign.redirect_message_success"), "info", TIMEOUT);
    redirect(`/${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns`);
  };

  /**
   * @function continueHandler function called on click of continue button from confirmation modal
   */
  const continueHandler = async () => {
    setConfirmDialog({ ...confirmDialog, isDisable: true });
    const { campaignName, geoId, keyword, targetUrl } = editCampaignObj;
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns/${id}`,
        payload: {
          id: { domainId: domain.toLowerCase() },
          data: {
            campaignName,
            geoId,
            keywords: keyword.length > 0 ? keyword.join(",") : "",
            targetUrl,
            fromDate: campaignDate.fromDate,
            thruDate: campaignDate.thruDate,
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
    setEditConfirmModal(false);
  };

  /**
   * @function cancelTagHandler function called on click of cancel button of Redirect Campaign Page
   */
  const cancelTagHandler = () => {
    redirect(`/${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns`);
  };

  /**
   *@function updateFormData function called on click of edit
   *@param {object} editObj event called on edit
   */
  const updateFormData = (editObj) => {
    showPopup();
    setEditCampaignObj({ ...editCampaignObj, ...editObj });
  };

  if (loading) {
    return <LoaderComponent />;
  }
  return (
    <>
      <SimpleShowLayout component="div">
        <SimpleForm
          save={updateFormData}
          initialValues={responseData}
          toolbar={<CustomToolbar onClickCancel={cancelTagHandler} saveButtonLabel={translate("update")} />}
          submitOnEnter={false}
        >
          <RedirectEditUI
            editCampaignObj={editCampaignObj}
            setEditCampaignObj={setEditCampaignObj}
            setNewKeyword={setNewKeyword}
            geoOptions={geoOptions}
            campaignDate={campaignDate}
            domain={domain}
            newKeyword={newKeyword}
            setCampaignDate={setCampaignDate}
          />
        </SimpleForm>
      </SimpleShowLayout>
      <SimpleModel
        {...confirmDialog}
        openModal={editConfirmModal}
        handleClose={() => setEditConfirmModal(false)}
        handleAction={continueHandler}
      />
    </>
  );
};

RedirectSearchEdit.propTypes = {
  id: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  getCampaignName: PropTypes.func.isRequired,
};

export default RedirectSearchEdit;
