/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Create,
  useTranslate,
  SimpleForm,
  required,
  useRedirect,
  useNotify,
  minLength,
  useCreate,
  useRefresh,
  useMutation,
} from "react-admin";
import { DialogContent, DialogContentText } from "@material-ui/core";
import SimpleModel from "../../../../components/CreateModal";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import LoaderComponent from "../../../../components/LoaderComponent";
import { onSuccess, onFailure } from "../../../../utils/CustomHooks";
import RedirectUI from "./CreateUI";
import CustomToolbar from "../../../../components/CustomToolbar";

/**
 * Component to create a campaign
 *
 *  @param {object} props all the props required by Redirect Campaign Create component
 * @returns {React.ReactElement} returns Create Redirect Campaign Create component
 */
const RedirectSearchCreate = (props) => {
  const { domain } = props;
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const initialFormData = {
    campaignName: "",
    geoId: "",
    keyword: [],
    targetUrl: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const { campaignName, geoId, keyword, targetUrl } = formData;
  const [confirmDialog, setConfirmDialog] = useState({});
  const [modalState, setModalState] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const refresh = useRefresh();
  const [mutate] = useMutation();
  const [loading, setLoading] = useState(false);
  const [geoOptions, setGeoOptions] = useState([]);
  const [campaignDate, setCampaignDate] = useState({
    fromDate: new Date(),
    thruDate: new Date(),
  });

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
    setLoading(false);
  };

  // This function is added to clear the form values when we change domain
  useEffect(() => {
    setFormData(initialFormData);
    setNewKeyword("");
    refresh();
    getGeoListAPICall();
  }, [domain]);

  /**
   * @function cancelHandler Function to close dialog
   */
  const cancelHandler = () => {
    redirect(`/${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns`);
  };

  const [handleCreateAction] = useCreate(
    `${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns`,
    {
      dataObj: JSON.stringify({
        campaignName,
        geoId,
        keywords: keyword.length > 0 ? keyword.join(",") : "",
        targetUrl,
        fromDate: campaignDate.fromDate,
        thruDate: campaignDate.thruDate,
      }),
      params: {
        domainId: domain.toLowerCase(),
      },
    },
    {
      onSuccess: (res) => {
        if (res.status === "success") {
          redirect(`/${window.REACT_APP_COLUMBUS_SERVICE}/configurations/redirect-campaigns`);
          notify(translate("redirect_campaign.create_success"));
          setModalState(false);
        } else {
          notify(res.message ? res.message : translate("redirect_campaign.campaign_create_error"), "error", TIMEOUT);
          setModalState(false);
        }
      },
      onFailure: (error) =>
        notify(error.message ? error.message : translate("redirect_campaign.campaign_create_error"), "error", TIMEOUT),
    },
  );

  /**
   * @function continueHandler function to disable user single clicked
   */
  const continueHandler = () => {
    setConfirmDialog({ ...confirmDialog, isDisable: true });
    handleCreateAction();
  };

  /**
   *@function dialogContent
   *@param {string } message name of the action
   *@returns {React.createElement} dialogue is return
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   *@function showPopup To show pop up
   *
   */
  const showPopup = () => {
    const dialogObject = {
      dialogContent: dialogContent(translate("redirect_campaign.create_show_popup")),
      showButtons: true,
      closeText: translate("no_button_label"),
      actionText: translate("yes_button_label"),
    };
    setConfirmDialog(dialogObject);
    setModalState(true);
  };

  /**
   *@function updateFormData function called on click of create
   *@param {object} createObj event called on create
   */
  const updateFormData = (createObj) => {
    showPopup();
    setFormData({ ...formData, ...createObj });
  };

  const validateName = [required(), minLength(2)];
  if (loading) {
    return <LoaderComponent />;
  }
  return (
    <>
      <Create {...props} component="div">
        <SimpleForm
          save={updateFormData}
          toolbar={<CustomToolbar onClickCancel={cancelHandler} saveButtonLabel={translate("create")} />}
          submitOnEnter={false}
        >
          <RedirectUI
            formData={formData}
            setFormData={setFormData}
            validateName={validateName}
            geoOptions={geoOptions}
            newKeyword={newKeyword}
            setNewKeyword={setNewKeyword}
            campaignDate={campaignDate}
            setCampaignDate={setCampaignDate}
            domain={domain}
          />
        </SimpleForm>
      </Create>
      <SimpleModel
        {...confirmDialog}
        openModal={modalState}
        handleClose={() => setModalState(false)}
        handleAction={continueHandler}
      />
    </>
  );
};

RedirectSearchCreate.propTypes = {
  resource: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
};

export default RedirectSearchCreate;
