/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState, useRef, memo, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslate, useNotify, useMutation } from "react-admin";
import { omit, sortBy } from "lodash";
import CampaignForm from "../CampaignForm";
import { ACTIVE, TWO_FIELD_OPERATOR } from "../CampaignForm/frequencyMapping";
import {
  AND,
  OMIT_KEYS,
  BOOLEAN_FIELD_ATTRIBUTES,
  getBooleanFieldValues,
  updateTagList,
} from "../CampaignForm/campaignFieldMapping";
import { onFailure, onSuccess } from "../../../../utils/CustomHooks";
import LoaderComponent from "../../../../components/LoaderComponent";
import { TIMEOUT } from "../../../../config/GlobalConfig";

/**
 * Component to For create campaign
 *
 * @param {object} props required for create component
 * @returns {React.ReactElement} return create campaign component
 */
const CampaignCreate = memo((props) => {
  const { history } = props;
  const formReference = useRef(null);
  const translate = useTranslate();
  const notify = useNotify();
  const [mutate, { loading }] = useMutation();
  const buttonLabel = translate("create");
  const pageTitle = translate("create_campaign_title");
  const [campaignCreated, setCampaignCreated] = useState(false);
  const [campaign, setCampaign] = useState({
    campaignName: "",
    domainId: "",
    domainList: [],
    recipientList: [],
    cityList: [],
    occasionList: [],
    geoId: [],
    geoList: [],
    currencyId: "",
    currencyList: [],
    publisherId: "",
    publisherList: [],
    attribute: "",
    attributeList: [],
    operator: "",
    operatorList: [],
    andConditions: [{ ...AND }],
    type: "",
    repeat: "",
    time: "",
    disableRepeat: true,
    disableTime: true,
    repeatOptions: [],
    productTypeList: [],
    shippingList: [],
  });

  useEffect(() => {
    const params = new URLSearchParams(history.location.search.substring(1));
    if (params.has("data")) {
      const paramData = params.get("data");
      try {
        setCampaign(JSON.parse(atob(paramData)));
      } catch (error) {
        notify(translate("unknown_error"), "error", TIMEOUT);
      }
    }
  }, []);

  /**
   * @function handleCreateCampaign function to navigate on campaign list and to notify
   * @param {object} res is passed to function
   */
  const handleCreateCampaign = useCallback((res) => {
    history.goBack();
    notify(res?.data?.message || translate("create_campaign_success_message"), "info", TIMEOUT);
  }, []);

  /**
   * @function handleBadCreateRequest to handle bad request
   * @param {object} response is passed to function
   */
  const handleBadCreateRequest = (response) => {
    setCampaignCreated(false);
    notify(response.message ? response.message : translate("error_boundary_heading"), "error", TIMEOUT);
  };

  /**
   * @function createCampaign callback function for create campaign
   * @param {object} data campaign data
   */
  const createCampaign = useCallback((data) => {
    setCampaignCreated(true);
    const campaignData = data.andConditions.map((andCondition) => {
      const filteredData = andCondition.orConditions.filter((orCondition) => orCondition.fieldId);
      if (filteredData.length) {
        const updatedOrConditions = filteredData.map((orCondition) => {
          if (orCondition.fieldOperator === TWO_FIELD_OPERATOR) {
            return {
              ...omit(orCondition, OMIT_KEYS),
              fieldOperand: `${orCondition.fromValue},${orCondition.toValue}`,
            };
          }

          if ([...Object.keys(BOOLEAN_FIELD_ATTRIBUTES)].includes(orCondition.fieldName)) {
            return getBooleanFieldValues(orCondition);
          }

          return {
            ...omit(orCondition, OMIT_KEYS),
            fieldOperand:
              typeof orCondition?.fieldOperand !== "string" && orCondition?.fieldOperand.length > 0
                ? orCondition?.fieldOperand.join(", ")
                : orCondition?.fieldOperand?.toString().trim(),
          };
        });
        return {
          ...andCondition,
          orConditions: [...updatedOrConditions],
        };
      }
      return false;
    });
    const updatedCampaignData = campaignData.filter((andCondition) => andCondition !== false);
    mutate(
      {
        type: "create",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/campaigns`,
        payload: {
          data: {
            dataObj: {
              andConditions: [...updatedCampaignData],
              campaign: {
                campaignDomainId: data.domainId,
                currencyId: data.currencyId,
                frequency: String(data.type).toUpperCase(),
                geoId: data.geoId.join(","),
                name: data.campaignName,
                publisherId: data.publisherId,
                repeat: data.repeat,
                time: data.time,
              },
            },
          },
        },
      },
      {
        onSuccess: (response) => {
          setCampaign(data);
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleCreateCampaign,
            handleBadRequest: handleBadCreateRequest,
          });
        },
        onFailure: (error) => {
          setCampaign(data);
          onFailure({ error, notify, translate });
          setCampaignCreated(false);
        },
      },
    );
  }, []);

  /**
   * @function handleAttributes function to set Attribute list
   * @param {object} res api response object
   * @param {object} form reference data
   */
  const handleAttributes = useCallback((res, form) => {
    const attributeValues = [];
    res.data.publisherConfigs.forEach((attribute) => {
      if (
        attribute.fieldStatus === ACTIVE &&
        attribute.productAttributeFieldMaster.isFilter &&
        attribute.productAttributeFieldMaster.fieldName
      )
        attributeValues.push({
          ...attribute,
          id: attribute.productAttributeFieldMaster.fieldName,
          name: attribute.productAttributeFieldMaster.fieldDisplayName,
          productAttributeName: attribute.productAttributeFieldMaster.fieldName,
          productAttributeId: attribute.productAttributeFieldMaster.id,
          operators: JSON.parse(attribute.productAttributeFieldMaster.operators),
        });
    });
    form.mutators.resetFilters([{ ...AND }]);
    form.mutators.setAttributeList([...sortBy(attributeValues, ["name"])]);
  }, []);

  /**
   * @function onPublisherChange callback to set product attributes
   * @param {string} publisherId selected publisher id
   * @param {object} form reference
   */
  const onPublisherChange = useCallback((publisherId, form) => {
    mutate(
      {
        type: "getOne",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/publishers/productattributefields/${publisherId}`,
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: () => {
              handleAttributes(response, form);
            },
          });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  }, []);

  /**
   * @function handleListOfTags function to set list as per key
   * @param {object} res response object
   * @param {string} value key to get respective data
   * @param {object} parentForm parent form reference
   * @param {string} operatorListSource source to set operator List
   */
  const handleListOfTags = useCallback((res, value, parentForm, operatorListSource) => {
    const list = res?.data?.data || [];
    updateTagList(value, parentForm, operatorListSource, list);
  }, []);

  /**
   * @function getListOfTagsByKey callback to get List of tag by key
   * @param {string} value key to get respective data
   * @param {object} parentForm parent form reference
   * @param {string} operatorListSource source to set operator List
   */
  const getListOfTagsByKey = useCallback((value, parentForm = null, operatorListSource = "") => {
    const tagKey = typeof value === "string" ? value : value.key;
    const params = {
      size: 100,
      sortParam: "tagName:asc",
    };
    const filters = [
      {
        fieldName: "TagTypeId",
        operatorName: "Like",
        fieldValue: tagKey,
      },
    ];
    params.filter = encodeURIComponent(JSON.stringify(filters));
    mutate(
      {
        type: "getData",
        resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
        payload: params,
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: () => {
              handleListOfTags(response, value, parentForm, operatorListSource);
            },
          });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  }, []);

  /**
   * @function handleOnGeoSuccess function to set geoList
   * @param {object} res api response
   * @param {object} parentForm form reference
   */
  const handleOnGeoSuccess = useCallback((res, parentForm) => {
    const geoValues = [];
    res.data.data.forEach((geo) => {
      geoValues.push({ id: geo.geoId, name: geo.geoName });
    });
    parentForm.mutators.setGeoList(geoValues);
  }, []);

  /**
   * @function onDomainChange to handle Domain change event
   * @param {string} domainId domain id of selected domain
   * @param {object} parentForm parent form reference
   */
  const onDomainChange = useCallback((domainId, parentForm) => {
    if (domainId) {
      mutate(
        {
          type: "getOne",
          resource: `${window.REACT_APP_GALLERIA_SERVICE}/geographies?domainId=${domainId}`,
        },
        {
          onSuccess: (response) => {
            onSuccess({
              response,
              notify,
              translate,
              handleSuccess: () => {
                handleOnGeoSuccess(response, parentForm);
              },
            });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate });
          },
        },
      );
    }
  }, []);

  /**
   * @function handleShippingOnSuccess function to set shipping list
   * @param {object} res response object
   */
  const handleShippingOnSuccess = useCallback((res, value, formData, operatorListSource) => {
    const response = res?.data?.data;
    const shippings = [];
    response.forEach((data) => {
      shippings.push({ id: data, name: data });
    });
    formData.mutators.setShippingList(value.source, shippings);
    formData.mutators.setOperatorList(operatorListSource, shippings);
  }, []);

  /**
   * @function getShippingList to get shipping list
   * @param {object} value mappingForm data
   * @param {object} formData form data
   * @param {string} operatorListSource location to set the state
   */
  const getShippingList = useCallback((value, formData, operatorListSource) => {
    mutate(
      {
        type: "getData",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/campaigns${value.url}`,
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: () => {
              handleShippingOnSuccess(response, value, formData, operatorListSource);
            },
          });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  }, []);

  if (campaignCreated) {
    return <LoaderComponent />;
  }

  return (
    <>
      <CampaignForm
        {...props}
        record={campaign}
        title={pageTitle}
        buttonLabel={buttonLabel}
        formReference={formReference}
        onSave={createCampaign}
        onPublisherChange={onPublisherChange}
        getListOfTagsByKey={getListOfTagsByKey}
        getShippingList={getShippingList}
        onDomainChange={onDomainChange}
        loading={loading}
      />
    </>
  );
});

CampaignCreate.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default CampaignCreate;
