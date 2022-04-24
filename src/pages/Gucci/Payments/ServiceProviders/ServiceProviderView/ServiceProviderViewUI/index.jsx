import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Grid, Typography, Divider } from "@material-ui/core";
import { useTranslate, SimpleShowLayout, Button } from "react-admin";
import useStyles from "../../../../../../assets/theme/common";
import LoaderComponent from "../../../../../../components/LoaderComponent";
import { useCustomQueryWithStore } from "../../../../../../utils/CustomHooks";
/**
 * Component for Service Provider View contains UI for Service Provider details.
 *
 * @param {object} props all the props needed for Service Provider View.
 * @returns {React.ReactElement} returns Service Providers View page.
 */
const ServiceProviderViewUI = (props) => {
  const { id } = props;
  const history = useHistory();
  const classes = useStyles();
  const translate = useTranslate();

  const [responseData, setResponseData] = useState(null);
  /**
   * @function handleSuccess This function will handle the after effects of success.
   * @param {object} response is passed to the function
   */
  const handleSuccess = (response) => {
    setResponseData(response.data);
  };

  const { loading } = useCustomQueryWithStore(
    "getOne",
    `${window.REACT_APP_GALLERIA_SERVICE}/categories/${id}`,
    handleSuccess,
  );

  /**
   * @function viewModeText function renders the Typography text for View Mode
   * @param {string } label field label
   * @param {inputData} inputData field input data from API response
   * @returns {React.createElement} returns a Typography label and text
   */
  const viewModeText = (label, inputData) => (
    <>
      <Typography variant="caption">{label}</Typography>
      <Typography variant="h6">{inputData}</Typography>
    </>
  );

  /**
   * @function onClickCancel function to navigate back to listing page.
   */
  const onClickCancel = () => {
    history.push("/gucci/v1/payment/providers");
  };

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <SimpleShowLayout component="div">
          <Grid
            className={classes.gridContainer}
            container
            direction="row"
            alignItems="flex-start"
            justify="space-between"
            md={12}
          >
            <Grid item className={classes.titleGridStyle}>
              <Typography variant="h4">{responseData?.categoryUrl}</Typography>
            </Grid>
          </Grid>
          <Divider className={classes.customMargin} />
          <Grid
            className={classes.customMargin}
            container
            direction="row"
            alignItems="flex-start"
            justify="space-between"
            md={9}
          >
            <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
              {viewModeText(translate("service_provider"), responseData?.categoryUrl)}
            </Grid>
            <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
              {viewModeText(translate("payment_options_supported"), responseData?.categoryName?.value)}
            </Grid>
            <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
              {viewModeText(translate("countries_supported"), responseData?.categoryType?.value?.categoryTypeName)}
            </Grid>
          </Grid>
          <Grid
            className={classes.customMargin}
            container
            direction="row"
            alignItems="flex-start"
            justify="space-between"
            md={3}
          >
            <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
              {viewModeText(translate("currencies_supported"), responseData?.baseCategory)}
            </Grid>
          </Grid>
          <Button variant="outlined" size="medium" label={translate("cancel")} onClick={onClickCancel} />
        </SimpleShowLayout>
      )}
    </>
  );
};

ServiceProviderViewUI.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ServiceProviderViewUI;
