/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslate, useNotify, useMutation } from "react-admin";
import { sortBy, omit } from "lodash";
import CampaignForm from "../CampaignForm";
import {
  AND,
  CAMPAIGN_FIELD_MAPPING,
  getUniqId,
  FIELD_TYPES,
  OMIT_KEYS,
  BOOLEAN_FIELD_ATTRIBUTES,
  getBooleanFieldValues,
  mapBooleanFieldValues,
  updateTagList,
} from "../CampaignForm/campaignFieldMapping";
import { ACTIVE, CAMPAIGN_FREQUENCY_MAPPING, TWO_FIELD_OPERATOR } from "../CampaignForm/frequencyMapping";
import { onFailure, onSuccess, useCustomQueryWithStore } from "../../../../utils/CustomHooks";
import LoaderComponent from "../../../../components/LoaderComponent";
import { TIMEOUT } from "../../../../config/GlobalConfig";

/**
 * Component to For Edit campaign
 *
 * @param {object} props required for edit component
 * @returns {React.ReactElement} returns edit campaign component
 */
const CampaignEdit = (props) => {
  const { id, history } = props;
  const translate = useTranslate();
  const notify = useNotify();
  const [mutate, { loading }] = useMutation();
  const buttonLabel = translate("save");
  const formReference = useRef(null);
  const [campaignName, setCampaignName] = useState();
  const [campaignEdited, setCampaignEdited] = useState(false);
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
   * @function handleAttributes function to set Attribute list
   * @param {object} res api response object
   * @param {object} form reference data
   */
  const handleAttributes = useCallback((res, form) => {
    const attributeValues = [];
    res?.data?.publisherConfigs.forEach((attribute) => {
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
   * @function handleShippingOnSuccess function to set shipping list
   * @param {object} res response object
   * @param {object} value mappingForm data
   * @param {object} formData form data
   * @param {string} operatorListSource location to set the state
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

  /**
   * @function updateCampaign to update Campaign data
   * @param {object} response campaign data
   */
  const updateCampaign = (response) => {
    formReference.current.batch(async () => {
      const { current: form } = formReference;
      form.change("campaignName", response.campaign.name);
      form.change("domainId", response.campaign.campaignDomainId);
      form.change("geoId", response.campaign.geoId.split(", "));
      form.change("currencyId", response.campaign.currencyId);
      form.change("publisherId", response.campaign.publisherId);
      form.change("type", response.campaign.frequency.toLowerCase());
      form.change("repeat", response.campaign.repeat);
      if (response.campaign.frequency.toLowerCase() !== CAMPAIGN_FREQUENCY_MAPPING.hourly.value)
        form.change("time", response.campaign.time);
      await onPublisherChange(response.campaign.publisherId, form);
      if (response.andConditions.length) {
        const updatedAndConditions = response.andConditions.map((andCondition, i) => {
          let orConditions = [...andCondition.orConditions];
          if (andCondition.orConditions) {
            orConditions = orConditions.map((orCondition, j) => {
              const mappings = CAMPAIGN_FIELD_MAPPING.find((mapping) =>
                mapping.attributes.includes(orCondition.fieldName),
              );
              if (mappings?.type === FIELD_TYPES.doubleInput) {
                if (orCondition.fieldOperator === TWO_FIELD_OPERATOR) {
                  const [fromValue, toValue] = orCondition.fieldOperand.split(",");
                  return {
                    ...orCondition,
                    fromValue,
                    toValue,
                    type: mappings?.type,
                    fieldOperand: [],
                    orId: getUniqId(),
                  };
                }
                return { ...orCondition, type: FIELD_TYPES.singleInputNumeric, orId: getUniqId() };
              }
              if (mappings?.type === FIELD_TYPES.checkBoxList) {
                const updatedOperand = orCondition.fieldOperand.split(", ");
                if (mappings?.API) {
                  const currentOperatorList = form.getState().values[mappings.source];
                  const currentSource = `andConditions[${i}].orConditions[${j}]`;
                  if (currentOperatorList?.length === 0) {
                    if (mappings?.url) {
                      getShippingList(mappings, form, `${currentSource}.operatorList`);
                    } else {
                      getListOfTagsByKey(mappings, form, `${currentSource}.operatorList`);
                    }
                  } else {
                    form.mutators.setOperatorList(currentSource, currentOperatorList || []);
                  }
                  return {
                    ...orCondition,
                    fieldOperand: [...updatedOperand],
                    type: FIELD_TYPES.checkBoxList,
                    orId: getUniqId(),
                  };
                }

                if ([...Object.keys(BOOLEAN_FIELD_ATTRIBUTES)].includes(orCondition.fieldName)) {
                  return mapBooleanFieldValues({
                    ...orCondition,
                    fieldOperand: [...updatedOperand],
                    type: FIELD_TYPES.checkBoxList,
                    operatorList: mappings?.options,
                    orId: getUniqId(),
                  });
                }

                return {
                  ...orCondition,
                  fieldOperand: [...updatedOperand],
                  type: FIELD_TYPES.checkBoxList,
                  operatorList: mappings?.options,
                  orId: getUniqId(),
                };
              }

              return { ...orCondition, type: mappings?.type, orId: getUniqId() };
            });
          }
          return { ...andCondition, andId: getUniqId(), orConditions };
        });
        formReference.current.change("andConditions", updatedAndConditions);
      } else {
        formReference.current.change("andConditions", [{ ...AND }]);
      }
    });
  };

  const campaignResource = `${window.REACT_APP_KITCHEN_SERVICE}/campaigns/${id}`;

  /**
   * @function handleOnSuccess function to call updateCampaign on api success
   * @param {object} res api response
   */
  const handleOnSuccess = (res) => {
    const response = res?.data;
    setCampaignName(response.campaign.name);
    const params = new URLSearchParams(history.location.search.substring(1));
    if (!params.has("data")) {
      updateCampaign(response);
    }
  };

  useCustomQueryWithStore("getData", campaignResource, handleOnSuccess);

  /**
   * @function handleUpdateCampaignOnSuccess function to navigate to campaign list on success
   * @param {object} res response
   */
  const handleUpdateCampaignOnSuccess = useCallback((res) => {
    history.goBack();
    notify(res?.data?.message || translate("edit_campaign_success_message"), "info", TIMEOUT);
  }, []);

  /**
   * @function handleBadCreateRequest to handle bad request
   * @param {object} response is passed to function
   */
  const handleBadCreateRequest = (response) => {
    setCampaignEdited(false);
    notify(response.message ? response.message : translate("error_boundary_heading"), "error", TIMEOUT);
  };

  /**
   * @function updateCampaignDetails to set updated campaign data
   * @param {object} data updated campaign object
   */
  const updateCampaignDetails = useCallback((data) => {
    setCampaignEdited(true);
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
            fieldOperand: !["string", "number"].includes(typeof orCondition?.fieldOperand)
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
        type: "put",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/campaigns/${id}`,
        payload: {
          data: {
            andConditions: [...updatedCampaignData],
            campaign: {
              frequency: String(data.type).toUpperCase(),
              name: data.campaignName,
              repeat: data.repeat,
              time: data.time,
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
            handleSuccess: handleUpdateCampaignOnSuccess,
            handleBadRequest: handleBadCreateRequest,
          });
        },
        onFailure: (error) => {
          setCampaign(data);
          onFailure({ error, notify, translate });
          setCampaignEdited(false);
        },
      },
    );
  }, []);

  if (campaignEdited) {
    return <LoaderComponent />;
  }

  return (
    <>
      <CampaignForm
        {...props}
        record={campaign}
        onSave={updateCampaignDetails}
        buttonLabel={buttonLabel}
        title={campaignName}
        formReference={formReference}
        onPublisherChange={onPublisherChange}
        getListOfTagsByKey={getListOfTagsByKey}
        getShippingList={getShippingList}
        isEdit
        loading={loading}
      />
    </>
  );
};

CampaignEdit.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  id: PropTypes.string.isRequired,
};

export default CampaignEdit;
