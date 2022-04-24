/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, memo } from "react";
import { useTranslate, useRedirect, useNotify, useMutation } from "react-admin";
import { Grid, Typography, Divider } from "@material-ui/core";
import AttributeFormIterator from "../AttributeFormIterator";
import usePublisherMasterStyles from "../publisherMasterStyle";
import LoaderComponent from "../../../../components/LoaderComponent";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import pollingService from "../../../../utils/pollingService";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component to create a New Publisher
 *
 * @returns {React.ReactElement} returns Publisher Create component
 */
const AddPublisher = () => {
  const classes = usePublisherMasterStyles();
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const [publisherCreated, setPublisherCreated] = useState(false);
  const [defaultAttribute, setDefaultAttribute] = useState({});
  const [publisherName, setPublisherName] = useState({});
  const buttonLabel = translate("add");
  const [mutate] = useMutation();
  const breadcrumbs = [
    { displayName: translate("publisher_manager"), navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/publishers` },
    { displayName: translate("add_new_publisher") },
  ];

  /**
   * handle on polling success
   *
   * @function onPollingSuccess to handle polling success
   */
  const onPollingSuccess = () => {
    redirect(`/${window.REACT_APP_PARTY_SERVICE}/publishers`);
  };

  const { handlePollingSuccess } = pollingService({
    notify,
    mutate,
    translate,
    setLoader: setPublisherCreated,
    url: `${window.REACT_APP_KITCHEN_SERVICE}/publishers/request-status`,
    successMessage: translate("publisher_successfully_added"),
    onPollingSuccess,
  });

  /**
   * @function handleSuccess This function will handle the success scenario
   * @param {object} response is passed to the function
   */
  const handleSuccess = (response) => {
    const res = response?.data;
    if (response) {
      const publisherNameDetails = {
        id: "",
        name: "",
      };
      setPublisherName((prevState) => ({ ...prevState, ...publisherNameDetails }));
      const filteredArray = res?.data.filter((attributeObject) => attributeObject.fieldDisplayName !== "");
      const productAttributes = {};
      filteredArray.map((val) => {
        const currentVal = {
          fieldStatus: true,
          aliasChecked: true,
          alias: "",
          aliasError: "",
          ...val,
        };
        productAttributes[val.id] = currentVal;
        return val;
      });
      setDefaultAttribute((prevState) => ({ ...prevState, ...productAttributes }));
    }
  };

  useCustomQueryWithStore(
    "getData",
    `${window.REACT_APP_KITCHEN_SERVICE}/publishers/default-attributes?sortParam=fieldDisplayName:ASC`,
    handleSuccess,
  );

  /**
   * @param {object} response response from API
   * @function to handle errors for response other than success
   */
  const handleBadCreateRequest = (response) => {
    setPublisherCreated(false);
    notify(response.message ? response.message : translate("error_boundary_heading"), "error", TIMEOUT);
  };

  /**
   * @function handleSuccessForCreate to handle success on create publisher
   * @param {object} response from API
   */
  const handleSuccessForCreate = (response) => {
    handlePollingSuccess(response.data.data.requestId);
  };

  /**
   * @function createNewPublisher for Create New Publisher
   * @param {object} savedData contains saved form data
   */
  const createNewPublisher = (savedData) => {
    const updatedAttributeList = savedData?.publisherConfigs.map((productField) => {
      const updatedProductField = { ...productField };
      updatedProductField.productAttributeFieldId = updatedProductField.id;
      updatedProductField.fieldStatus = productField.fieldStatus ? "ACTIVE" : "INACTIVE";
      const { aliasChecked, aliasError, fieldName, fieldDisplayName, id, ...rest } = updatedProductField;
      return { ...rest };
    });
    setPublisherCreated(true);
    setDefaultAttribute(() => {
      return { ...savedData.publisherConfigs };
    });
    setPublisherName((prevState) => {
      return { ...prevState, id: savedData.publisherId || "", name: savedData.publisherName };
    });
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/publishers`,
        payload: {
          data: {
            dataObj: { ...savedData, publisherId: savedData.publisherId, publisherConfigs: updatedAttributeList },
          },
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleSuccessForCreate,
            handleBadRequest: handleBadCreateRequest,
          });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
          setPublisherCreated(false);
        },
      },
    );
  };

  if (publisherCreated) {
    return <LoaderComponent />;
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item className={classes.titleStyle}>
        <Typography variant="h5" color="inherit" className={classes.titleLineHeight}>
          {translate("add_new_publisher")}
        </Typography>
      </Grid>
      <Divider variant="fullWidth" />
      <AttributeFormIterator
        publisherData={defaultAttribute}
        publisherName={publisherName}
        buttonLabel={buttonLabel}
        onSave={createNewPublisher}
      />
    </>
  );
};

export default memo(AddPublisher);
