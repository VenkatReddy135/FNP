/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { Button, useTranslate, useNotify, useMutation } from "react-admin";
import { Typography, Box, makeStyles } from "@material-ui/core";
import { omit } from "lodash";
import { color, campaignPreviewOptions, TIMEOUT } from "../../../../config/GlobalConfig";
import { OMIT_KEYS, BOOLEAN_FIELD_ATTRIBUTES, getBooleanFieldValues } from "../CampaignForm/campaignFieldMapping";
import { TWO_FIELD_OPERATOR } from "../CampaignForm/frequencyMapping";
import SimpleGrid from "../../../../components/SimpleGrid";
import LoaderComponent from "../../../../components/LoaderComponent";
import useCommonStyles from "../../../../assets/theme/common";
import { onFailure, onSuccess } from "../../../../utils/CustomHooks";
import Breadcrumbs from "../../../../components/Breadcrumbs";

const useStyles = makeStyles({
  button: {
    marginLeft: "auto",
    marginBottom: "10px",
  },
  tableTitle: {
    display: "inline-flex",
  },
  campaignTitle: {
    color: `${color.green}`,
  },
  previewTitle: {
    color: `${color.darkGray}`,
  },
  errorMessage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

const GRID_LOADER_TIMEOUT = 250;

const PREVIEW_FIELD_MAP = {
  p_occasion: "Primary Occasion",
  p_recipient: "Primary Recipient",
};

/**
 * Component to create a campaign preview
 *
 *  @param {object} props all the props needed for Preview Campaign List
 * @returns {React.ReactElement} returns Campaign preview component
 */
const CampaignPreview = (props) => {
  const { history } = props;
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const [state, setState] = useState({
    columnNames: [],
    columns: [],
    filterData: {},
    encryptedUrl: "",
    campaignId: "",
  });
  const [formData, setFormData] = useState({
    errorMessage: translate("no_results_found"),
    gridLoader: true,
    pageSize: campaignPreviewOptions[0].id,
    filter: [],
  });
  const [mutate] = useMutation();

  /**
   * @function getColumnHeading function to get column name
   * @param {string} name is passed for formatting it
   * @returns {string} formatted name returned
   */
  const getColumnHeading = (name = "") => {
    if (PREVIEW_FIELD_MAP[name]) {
      return PREVIEW_FIELD_MAP[name];
    }
    let updatedName = name.toString().split("_");
    updatedName = updatedName.map((namePart) => namePart.charAt(0).toUpperCase() + namePart.slice(1));
    return updatedName.join(" ").trim();
  };

  /**
   * @function handlePreviewCampaignSuccess function to call on success of API call
   * @param {object} response is passed to function
   */
  const handlePreviewCampaignSuccess = (response) => {
    if (response.data) {
      const list = [...response.data.data];
      let columnNames = [];
      if (list.length) {
        columnNames = Object.keys(list[0]);
        columnNames = columnNames.map((name) => ({
          source: name,
          type: "TextField",
          label: getColumnHeading(name),
          sortable: false,
        }));
      }
      setState((prevState) => {
        return { ...prevState, columns: list, columnNames };
      });
    }
  };

  /**
   * @function handlePreviewCampaignBadRequest function to call on bad request of API call
   * @param {object} response is passed to function
   */
  const handlePreviewCampaignBadRequest = (response) => {
    const errorMessage = response?.data?.errors[0]?.message;
    notify(errorMessage || translate("error_boundary_heading"), "error", TIMEOUT);
    setFormData((prevState) => ({
      ...prevState,
      gridLoader: false,
      errorMessage: translate("on_failure_error_message"),
    }));
  };

  /**
   * @function getFormData callback function for getting filter values
   * @param {object} data campaign data
   * @param {number} pageSize page size
   */
  const getFormData = (data, pageSize) => {
    const campaignData = data.andConditions.map((andCondition) => {
      const filteredData = andCondition.orConditions.filter((orCondition) => orCondition.fieldId);
      if (filteredData.length) {
        const updatedOrConditions = filteredData.map((orCondition) => {
          if (orCondition.fieldOperator === TWO_FIELD_OPERATOR) {
            return {
              ...omit(orCondition, [...OMIT_KEYS]),
              fieldName: orCondition.fieldName,
              fieldOperand: `${orCondition.fromValue},${orCondition.toValue}`,
            };
          }

          if ([...Object.keys(BOOLEAN_FIELD_ATTRIBUTES)].includes(orCondition.fieldName)) {
            return getBooleanFieldValues(orCondition);
          }

          return {
            ...omit(orCondition, [...OMIT_KEYS]),
            fieldName: orCondition.fieldName,
            fieldOperand: !["string", "number"].includes(typeof orCondition?.fieldOperand)
              ? orCondition?.fieldOperand.join(", ")
              : orCondition?.fieldOperand?.toString().trim(),
          };
        });
        return {
          ...omit(andCondition, "andId"),
          orConditions: [...updatedOrConditions],
        };
      }
      return false;
    });
    const updatedCampaignData = campaignData.filter((andCondition) => andCondition);
    const previewDetails = {
      andConditions: updatedCampaignData,
      campaign: {
        campaignDomainId: data.domainId,
        currencyId: data.currencyId,
        geoId: data.geoId.join(","),
        publisherId: data.publisherId,
      },
    };
    const encryptedData = encodeURI(JSON.stringify(previewDetails));
    setFormData((prevState) => ({ ...prevState, filter: encryptedData }));
    mutate(
      {
        type: "getData",
        resource: `${window.REACT_APP_KITCHEN_SERVICE}/campaigns/preview`,
        payload: {
          filter: encryptedData,
          page: 0,
          size: pageSize,
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handlePreviewCampaignSuccess,
            handleBadRequest: handlePreviewCampaignBadRequest,
          });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
          setFormData((prevState) => ({
            ...prevState,
            gridLoader: false,
            errorMessage: translate("on_failure_error_message"),
          }));
        },
      },
    );
  };
  useEffect(() => {
    const parameters = new URLSearchParams(history?.location?.search?.substring(1));
    const encryptedDetails = parameters.get("data");

    try {
      const pageSize = parameters.get("pageSize");
      const campaignId = parameters.get("campaignId");
      const filteredValue = JSON.parse(atob(encryptedDetails));
      const updatedState = { ...state, encryptedUrl: encryptedDetails, filterData: filteredValue, campaignId };
      localStorage.removeItem("DATA_GRID_HEADER_CUSTOMIZATION");
      setState({ ...updatedState });
      setFormData((prevState) => ({ ...prevState, pageSize }));
      getFormData(filteredValue, pageSize || formData.pageSize);
      setTimeout(() => {
        setFormData((prevState) => ({ ...prevState, gridLoader: false }));
      }, GRID_LOADER_TIMEOUT);
    } catch {
      setFormData((prevState) => ({
        ...prevState,
        gridLoader: false,
        errorMessage: translate("on_failure_error_message"),
      }));
      setState({ ...state, filterData: "" });
    }
  }, []);

  useEffect(() => {
    const { location } = history || { location: window.location };
    const { encryptedUrl, campaignId } = state;

    if (history && history.action === "POP" && encryptedUrl && !location.pathname.includes("/preview")) {
      if (location.pathname.includes("/create") || location.pathname.includes(`/${campaignId}`)) {
        history.replace(`${location.pathname}?data=${encryptedUrl}`);
      }
    }
  }, [history]);

  /**
   * @function goBack function navigate to previous page
   */
  const goBack = () => {
    history.goBack();
  };

  if (formData.gridLoader || !formData.filter.length) {
    return <LoaderComponent />;
  }

  const breadcrumbs = [
    {
      displayName: translate("campaign_manager"),
      navigateTo: `/${window.REACT_APP_KITCHEN_SERVICE}/campaigns`,
    },
    { displayName: translate("preview_title") },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className={`${classes.tableTitle} ${commonClasses.categoryMarginTop}`}>
        {state.filterData.campaignName && (
          <Typography variant="h5">
            <span className={classes.previewTitle}>{`${translate("preview_title")}`}</span>
            <span className={classes.campaignTitle}>{` - ${state.filterData.campaignName}`}</span>
          </Typography>
        )}
        <Button variant="contained" className={classes.button} label={translate("exit_preview")} onClick={goBack} />
      </div>

      {state.columnNames.length ? (
        <SimpleGrid
          {...props}
          resource={`${window.REACT_APP_KITCHEN_SERVICE}/campaigns/preview`}
          configurationForGrid={state.columnNames}
          actionButtonsForGrid={[]}
          syncWithLocation={false}
          isSearchEnabled={false}
          filter={{
            filter: formData.filter,
            size: formData.pageSize,
          }}
          isCustomPagination
          rowsPerPageOptions={[formData.pageSize]}
        />
      ) : (
        <Box className={classes.errorMessage}>
          <Typography component="div" variant="h5">
            {formData.errorMessage}
          </Typography>
        </Box>
      )}
    </>
  );
};

CampaignPreview.propTypes = {
  history: PropTypes.shape({
    action: PropTypes.string,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }),
    replace: PropTypes.func,
    goBack: PropTypes.func,
    listen: PropTypes.func,
  }).isRequired,
};

export default memo(CampaignPreview);
