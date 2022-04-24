/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from "react";
import PropTypes from "prop-types";
import {
  ArrayInput,
  FormDataConsumer,
  FormWithRedirect,
  SimpleFormIterator,
  useNotify,
  useTranslate,
} from "react-admin";
import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import CampaignDetails from "./CampaignDetails";
import OrFilter from "./OrFilter";
import { color, TIMEOUT } from "../../../../config/GlobalConfig";
import FrequencySetter from "./FrequencySetter";
import campaignMutators from "./campaignMutators";
import { getUniqId, OR, AND } from "./campaignFieldMapping";
import { removeExtraSpaces } from "../../../../utils/helperFunctions";

const useStyles = makeStyles({
  filterBox: {
    backgroundColor: `${color.gray}`,
  },
  mainForm: {
    marginTop: "0.5em",
  },
  orButtonContainer: {
    backgroundColor: `${color.white}`,
    marginTop: 7,
    marginBottom: 8,
    paddingBottom: 32,
  },
  formIterator: {
    backgroundColor: `${color.gray}`,
    paddingLeft: "1em",
    margin: 0,
    "& li": {
      borderBottom: "none",
      "&>p": {
        display: "none",
      },
    },
    "& section": {
      display: "inline-block",

      "& li:nth-last-child(2)": {
        "& .or-label": {
          display: "none",
        },
      },
    },
    "& >li:nth-last-child(2)": {
      "& .and-label": {
        display: "none",
      },
    },
  },
});

/**
 * Component to create And component
 *
 * @param {object} props create An component
 * @returns {React.ReactElement} returns Create Campaign component
 */
const CampaignForm = (props) => {
  const {
    record,
    buttonLabel,
    onSave,
    title,
    formReference,
    onPublisherChange,
    onDomainChange,
    getListOfTagsByKey,
    getShippingList,
    isEdit,
    loading,
  } = props;
  const classes = useStyles();
  const notify = useNotify();
  const translate = useTranslate();

  /**
   * @function handleFormCancel to handle cancel action
   */
  const handleFormCancel = () => {
    props.history.push(`/${window.REACT_APP_KITCHEN_SERVICE}/campaigns`);
  };

  /**
   * @function addOrCondition to add OR condition
   * @param {object} data scoped form data
   * @param {object} formData complete form data
   */
  const addOrCondition = (data, formData) => {
    const selectedRecord = { ...data };
    const details = { ...formData.getState().values };
    const updatedOrConditions = details.andConditions.map((andForm) => {
      if (andForm.andId === selectedRecord.andId) {
        return {
          ...andForm,
          orConditions: [...andForm.orConditions, { ...OR, orId: getUniqId() }],
        };
      }
      return andForm;
    });

    formData.mutators.updateFilterCondition("andConditions", updatedOrConditions);
  };

  /**
   * @function addAndCondition to add AND condition
   * @param {object} formData form data
   */
  const addAndCondition = (formData) => {
    const existingAndConditions = [...formData.getState().values.andConditions];
    const newAndCondition = {
      ...AND,
      orConditions: [{ ...OR, orId: getUniqId() }],
      andId: getUniqId(),
    };
    const updatedAndConditions = [...existingAndConditions, { ...newAndCondition }];
    formData.mutators.updateFilterCondition("andConditions", updatedAndConditions);
  };

  /**
   * @function deleteOrCondition deletes OR condition
   * @param {string} orId OR form id
   * @param {string} andId AND form id
   * @param {object} formData form data
   */
  const deleteOrCondition = (orId, andId, formData) => {
    const details = { ...formData.getState().values };
    const updatedOrConditions = details.andConditions.map((andForm) => {
      if (andForm.andId === andId) {
        const updatedOrs = andForm.orConditions.filter((orForm) => orForm.orId !== orId);
        return {
          ...andForm,
          orConditions: [...updatedOrs],
        };
      }
      return andForm;
    });
    const andConditions = updatedOrConditions.filter((andForm) => andForm.orConditions.length > 0);
    formData.mutators.updateFilterCondition("andConditions", andConditions);
    notify(translate("filter_removed_message"), "info", TIMEOUT);
  };

  /**
   * @function onSaveCampaign to create campaign
   * @param {object} data campaign data to create
   */
  const onSaveCampaign = (data) => {
    onSave({ ...data, campaignName: removeExtraSpaces(data.campaignName) });
  };

  /**
   * @function setFormReference function to set form reference
   * @param {object} form form data
   */
  const setFormReference = useCallback(
    (form) => {
      if (!formReference.current) {
        formReference.current = form;
      }
    },
    [formReference],
  );

  return (
    <FormWithRedirect
      {...props}
      save={onSaveCampaign}
      mutators={campaignMutators}
      record={record}
      render={({ handleSubmitWithRedirect, ...rest }) => (
        <form>
          <CampaignDetails
            parentForm={rest.form}
            details={rest.form.getState().values}
            onPublisherChange={onPublisherChange}
            getListOfTagsByKey={getListOfTagsByKey}
            onDomainChange={onDomainChange}
            title={title}
            isEdit={isEdit}
          />
          <Box className={classes.filterBox} pb="1em" mb="2em">
            <Box pt="1em" pl="1em">
              <Typography variant="subtitle2">{translate("campaign_filter_title")}</Typography>
            </Box>
            <ArrayInput source="andConditions" label="" className={classes.mainForm}>
              <SimpleFormIterator addButton={<></>} removeButton={<></>} className={classes.formIterator}>
                <FormDataConsumer>
                  {({ scopedFormData, getSource }) => (
                    <>
                      <Box mr="1em">
                        {scopedFormData && (
                          <Box display="flex">
                            <Box flex={10}>
                              <OrFilter
                                details={getSource("orConditions")}
                                formData={rest.form.getState().values}
                                andFormId={scopedFormData.andId}
                                onDelete={(orId, andFormId) => {
                                  deleteOrCondition(orId, andFormId, rest.form);
                                }}
                                getListOfTagsByKey={getListOfTagsByKey}
                                getShippingList={getShippingList}
                                parentForm={rest.form}
                              />
                            </Box>
                            <Box display="flex" alignItems="flex-end" className={classes.orButtonContainer}>
                              <Button
                                variant="outlined"
                                color="primary"
                                disabled={!rest?.form?.getState()?.values?.publisherId.length}
                                onClick={() => addOrCondition(scopedFormData, rest.form)}
                              >
                                {translate("campaign_select_or")}
                              </Button>
                            </Box>
                          </Box>
                        )}
                      </Box>
                      <Box ml="5em" mt="0.5em" className="and-label" fontWeight="fontWeightMedium">
                        {translate("campaign_select_and")}
                      </Box>
                    </>
                  )}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
            <Box display="flex" ml="1em">
              <Button
                variant="outlined"
                color="default"
                onClick={() => addAndCondition(rest.form)}
                disabled={!rest?.form?.getState()?.values?.publisherId.length}
              >
                {translate("campaign_select_and")}
              </Button>
            </Box>
          </Box>
          <FrequencySetter parentForm={rest.form} />
          <Box display="flex" mt="1em">
            <Button variant="outlined" color="default" onClick={handleFormCancel}>
              {translate("cancel")}
            </Button>
            <Button variant="contained" color="default" onClick={handleSubmitWithRedirect} disabled={loading}>
              {buttonLabel}
            </Button>
          </Box>
          {setFormReference(rest.form)}
        </form>
      )}
    />
  );
};

CampaignForm.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  record: PropTypes.objectOf(PropTypes.object).isRequired,
  onSave: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  formReference: PropTypes.objectOf(PropTypes.object).isRequired,
  onPublisherChange: PropTypes.func.isRequired,
  onDomainChange: PropTypes.func.isRequired,
  getListOfTagsByKey: PropTypes.func.isRequired,
  getShippingList: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  loading: PropTypes.bool,
};

CampaignForm.defaultProps = {
  isEdit: false,
  loading: false,
};

export default CampaignForm;
