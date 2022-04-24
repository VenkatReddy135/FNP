/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useCallback, memo } from "react";
import { Grid, Typography, Divider, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate, TextInput, SelectInput, FormDataConsumer, required, useRedirect, useNotify } from "react-admin";
import { omit, isEmpty, sortBy } from "lodash";
import { useParams } from "react-router-dom";
import SplitButton from "../../../../../components/SplitButton";
import BoundedCheckBoxDropdown from "../../../../../components/BoundedCheckBoxDropdown";
import { color, campaignPreviewOptions, TIMEOUT } from "../../../../../config/GlobalConfig";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

const useStyles = makeStyles(() => ({
  campBasic: {
    width: "170px",
    marginRight: "10px",
  },
  headerClass: {
    marginBottom: "10px",
    marginTop: "10px",
  },
  pageTitle: {
    color: `${color.green}`,
  },
  disableField: {
    opacity: "0.5",
  },
  editTitle: {
    color: `${color.darkGray}`,
  },
}));

/**
 * Component to create a campaign
 *
 * @param {object}  props required props to render this component
 * @returns {React.ReactElement} returns Create Campaign component
 */
const CampaignDetails = memo((props) => {
  const { parentForm, onPublisherChange, onDomainChange, getListOfTagsByKey, title, isEdit } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const redirect = useRedirect();
  const urlParam = useParams();
  const notify = useNotify();

  useEffect(() => {
    getListOfTagsByKey("D", parentForm);
  }, []);

  /**
   * @function onFailure
   * @param {object} error object
   * @returns {string} error message
   */
  const publisherResource = `${window.REACT_APP_PARTY_SERVICE}/publishers`;
  const publisherPayload = {
    page: 0,
    size: 200,
    sortParam: "id:asc",
  };

  /**
   * @function handleOnSuccessForPublisher this function will set the data
   * @param {object} res is passed to the function
   */
  const handleOnSuccessForPublisher = (res) => {
    const response = res?.data?.data;
    const listOfPublisher = [];
    response.forEach((data) => {
      listOfPublisher.push({ id: data.id, name: data.name });
    });
    parentForm.mutators.setField("publisherList", [...sortBy(listOfPublisher, ["name"])]);
  };

  useCustomQueryWithStore("getData", publisherResource, handleOnSuccessForPublisher, {
    payload: publisherPayload,
  });

  /**
   * @function handleOnSuccessForCurrencies this function will set the data
   * @param {object} res is passed to the function
   */
  const handleOnSuccessForCurrencies = (res) => {
    const response = res?.data?.data || [];
    const listOfCurrency = [];
    response.forEach((data) => {
      listOfCurrency.push({ id: data.uomId, name: data.uomDescription });
    });
    parentForm.mutators.setField("currencyList", [...listOfCurrency]);
  };

  const currencyResource = `${window.REACT_APP_TIFFANY_SERVICE}/uoms?uomType=CURRENCY`;
  useCustomQueryWithStore("getData", currencyResource, handleOnSuccessForCurrencies);

  /**
   * @function onGeoChange to handle geo change event
   * @param {object} event change event object
   */
  const onGeoChange = (event) => {
    parentForm.mutators.setGeoId([...event.target.value]);
  };

  /**
   * @function onPublisherUpdate to handle Publisher change event
   * @param {string} publisherId id of selected publisher
   * @param {object} formData parent form reference
   */
  const onPublisherUpdate = useCallback((publisherId, formData) => {
    formData.mutators.setField("publisherId", publisherId);
    onPublisherChange(publisherId, formData);
  }, []);

  /**
   * @function handleClick handles preview button action
   * @param {object} value preview button choice object
   */
  const handleClick = useCallback((value) => {
    try {
      const campaignData = btoa(JSON.stringify(parentForm.getState().values));
      const { andConditions } = parentForm.getState().values;
      const isError = Object.keys(omit(parentForm.getState().errors, "type", "repeat", "time")).length;
      if (!isError) {
        if (isEdit) {
          redirect(`preview?pageSize=${value.id}&campaignId=${urlParam.id}&data=${campaignData}`);
        } else {
          redirect(`preview?pageSize=${value.id}&data=${campaignData}`);
        }
      } else {
        parentForm.batch(() => {
          parentForm.blur("campaignName");
          parentForm.blur("domainId");
          parentForm.blur("currencyId");
          parentForm.blur("publisherId");
          parentForm.blur("geoId");
          andConditions.forEach((andCondition, i) => {
            if (andCondition.orConditions.length) {
              andCondition.orConditions.forEach((orCondition, j) => {
                if (orCondition.fieldName.length) {
                  parentForm.blur(`andConditions[${i}].orConditions[${j}].fieldName`);
                  parentForm.blur(`andConditions[${i}].orConditions[${j}].fieldOperand`);
                  parentForm.blur(`andConditions[${i}].orConditions[${j}].fieldOperator`);
                  parentForm.blur(`andConditions[${i}].orConditions[${j}].fromValue`);
                  parentForm.blur(`andConditions[${i}].orConditions[${j}].toValue`);
                }
              });
            }
          });
        });
      }
    } catch (error) {
      notify(translate("unknown_error"), "error", TIMEOUT);
    }
  }, []);

  /**
   * @function validateCampaignName to validate campaign name
   * @param {string} value name of campaign
   * @returns {string} validation message or undefined
   */
  const validateCampaignName = (value) => {
    return !value.trim().length ? translate("required_field") : undefined;
  };

  const fieldRequiredValidation = required(translate("required_field"));

  const campaignNameValidation = [fieldRequiredValidation, validateCampaignName];

  const breadcrumbs = [
    {
      displayName: translate("campaign_manager"),
      navigateTo: `/${window.REACT_APP_KITCHEN_SERVICE}/campaigns`,
    },
    { displayName: isEdit ? translate("edit_campaign_title") : title },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid
        item
        container
        direction="row"
        alignItems="flex-start"
        justify="space-between"
        className={classes.headerClass}
      >
        <Grid item>
          <Typography variant="h5" className={classes.pageTitle}>
            {isEdit ? (
              <>
                <span className={classes.editTitle}>{`${translate("edit_campaign_title")} :`}</span>
                <span className={classes.pageTitle}>{` ${title}`}</span>
              </>
            ) : (
              title
            )}
          </Typography>
        </Grid>
        <Grid item>
          <SplitButton
            label={translate("preview_title")}
            options={[...campaignPreviewOptions]}
            onSelect={handleClick}
          />
        </Grid>
      </Grid>
      <Divider variant="fullWidth" />
      <FormDataConsumer>
        {({ formData, ...rest }) => (
          <Grid item container direction="row" alignItems="flex-start" justify="space-between" md={11}>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <TextInput
                {...rest}
                source="campaignName"
                label={translate("campaign_name")}
                variant="standard"
                validate={campaignNameValidation}
                className={classes.campBasic}
                autoComplete="Off"
              />
            </Grid>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <SelectInput
                {...rest}
                source="domainId"
                choices={[...formData.domainList]}
                label={translate("domain")}
                variant="standard"
                validate={fieldRequiredValidation}
                className={`${classes.campBasic} ${isEdit && classes.disableField}`}
                onChange={(event) => {
                  onDomainChange(event?.target?.value || "", parentForm);
                }}
                disabled={isEdit}
              />
            </Grid>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <BoundedCheckBoxDropdown
                id="geo-list"
                source="geoId"
                type="select"
                label={translate("geo")}
                disabled={isEmpty(formData.domainId) || isEmpty(formData.geoList) || isEdit}
                validate={fieldRequiredValidation}
                options={formData.geoList}
                className={`${classes.campBasic} ${isEdit && classes.disableField}`}
                onChange={(e) => onGeoChange(e)}
                selectAll
              />
            </Grid>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <SelectInput
                {...rest}
                source="currencyId"
                label={translate("currency")}
                variant="standard"
                validate={fieldRequiredValidation}
                choices={[...formData.currencyList]}
                className={`${classes.campBasic} ${isEdit && classes.disableField}`}
                disabled={isEdit}
              />
            </Grid>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <SelectInput
                {...rest}
                source="publisherId"
                label={translate("publisher")}
                variant="standard"
                validate={fieldRequiredValidation}
                className={`${classes.campBasic} ${isEdit && classes.disableField}`}
                choices={[...formData.publisherList]}
                onChange={(event) => onPublisherUpdate(event.target.value, parentForm)}
                disabled={isEdit}
              />
            </Grid>
          </Grid>
        )}
      </FormDataConsumer>
    </>
  );
});

CampaignDetails.propTypes = {
  parentForm: PropTypes.objectOf(PropTypes.any).isRequired,
  getListOfTagsByKey: PropTypes.func.isRequired,
  title: PropTypes.string,
  onPublisherChange: PropTypes.func,
  onDomainChange: PropTypes.func,
  isEdit: PropTypes.bool,
};

CampaignDetails.defaultProps = {
  onPublisherChange: () => {},
  onDomainChange: () => {},
  title: "",
  isEdit: false,
};

export default CampaignDetails;
