/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, memo } from "react";
import { useTranslate, useRedirect, useMutation, useNotify } from "react-admin";
import { Box, Grid, Typography, Divider } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { sortBy } from "lodash";
import LoaderComponent from "../../../../components/LoaderComponent";
import pollingService from "../../../../utils/pollingService";
import usePublisherMasterStyles from "../publisherMasterStyle";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import AttributeFormIterator from "../AttributeFormIterator";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../components/Breadcrumbs";

/**
 * Component to Edit Publisher
 *
 * @returns {React.ReactElement} returns Publisher Edit component
 */
const PublisherEdit = () => {
  const classes = usePublisherMasterStyles();
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const { id } = useParams();
  const [publisherUpdated, setPublisherUpdated] = useState(false);
  const [defaultAttribute, setDefaultAttribute] = useState({});
  const [displayPublisherName, setDisplayPublisherName] = useState({});
  const [mutate] = useMutation();
  const buttonLabel = translate("save");
  const breadcrumbs = [
    { displayName: translate("publisher_manager"), navigateTo: `/${window.REACT_APP_PARTY_SERVICE}/publishers` },
    { displayName: translate("edit_publisher") },
  ];

  /**
   * Function to handle polling success
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
    setLoader: setPublisherUpdated,
    url: `${window.REACT_APP_KITCHEN_SERVICE}/publishers/request-status`,
    successMessage: translate("publisher_successfully_updated"),
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
        id,
        name: res?.publisherName,
      };
      setDisplayPublisherName((prevState) => ({ ...prevState, ...publisherNameDetails }));
      const productAttributes = {};
      let sortedPublisherAttributes = res?.publisherConfigs ? [...res.publisherConfigs] : [];
      sortedPublisherAttributes = sortBy(sortedPublisherAttributes, "productAttributeFieldMaster.fieldDisplayName");
      sortedPublisherAttributes.map((val) => {
        const currentVal = {
          aliasError: "",
          ...val,
        };
        const fieldName = val.productAttributeFieldMaster;
        currentVal.fieldDisplayName = fieldName.fieldDisplayName;
        if (val.fieldStatus === "ACTIVE") {
          currentVal.fieldStatus = true;
        } else {
          currentVal.fieldStatus = false;
        }
        currentVal.aliasChecked = !val.alias;
        productAttributes[val.productAttributeFieldId] = currentVal;
        return val;
      });
      setDefaultAttribute((prevState) => ({ ...prevState, ...productAttributes }));
    }
  };

  useCustomQueryWithStore(
    "getOne",
    `${window.REACT_APP_KITCHEN_SERVICE}/publishers/productattributefields/${id}`,
    handleSuccess,
  );

  /**
   * @function handleUpdateSuccess to handle success on publisher update
   * @param {object} response response from API
   */
  const handleUpdateSuccess = (response) => {
    handlePollingSuccess(response?.data?.requestId);
  };

  /**
   * @function handleBadUpdateRequest to handle errors for update response other than success
   * @param {object} response response from API
   */
  const handleBadUpdateRequest = (response) => {
    setPublisherUpdated(false);
    notify(response.message ? response.message : translate("error_boundary_heading"), "error", TIMEOUT);
  };

  /**
   * @function editPublisher called on click of Save button
   * @param {object} savedData contains saved form data
   */
  const editPublisher = (savedData) => {
    const updatedAttributeList = savedData?.publisherConfigs.map((productField) => {
      const updatedProductField = { ...productField };
      updatedProductField.fieldStatus = productField.fieldStatus ? "ACTIVE" : "INACTIVE";
      const { aliasChecked, aliasError, fieldDisplayName, productAttributeFieldMaster, ...rest } = updatedProductField;
      return { ...rest };
    });
    setPublisherUpdated(true);
    setDefaultAttribute(() => {
      return { ...savedData.publisherConfigs };
    });
    setDisplayPublisherName((prevState) => {
      return { ...prevState, id: savedData.publisherId || "", name: savedData.publisherName };
    });
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/publishers/${id}`,
        payload: {
          data: { ...savedData, publisherId: savedData.publisherId, publisherConfigs: updatedAttributeList },
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleUpdateSuccess,
            handleBadRequest: handleBadUpdateRequest,
          });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
          setPublisherUpdated(false);
        },
      },
    );
  };

  if (publisherUpdated) {
    return <LoaderComponent />;
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item>
        <Box display="flex" justifyContent="flex-start">
          <Box>
            <Typography variant="h5" color="inherit" className={classes.titleColor}>
              {`${translate("edit_publisher")} :`}
            </Typography>
          </Box>
          <Box minWidth="100px" pt="0.7em">
            <Typography variant="h5" color="inherit" className={classes.titleStyle}>
              {displayPublisherName.name}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Divider variant="fullWidth" />
      <AttributeFormIterator
        publisherData={defaultAttribute}
        publisherName={displayPublisherName}
        buttonLabel={buttonLabel}
        onSave={editPublisher}
      />
    </>
  );
};

export default memo(PublisherEdit);
