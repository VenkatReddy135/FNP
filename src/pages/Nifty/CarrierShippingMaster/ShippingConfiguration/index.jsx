import React, { useState, useMemo, useCallback } from "react";
import { FormWithRedirect, useTranslate } from "react-admin";
import { useHistory, useParams } from "react-router-dom";
import { Box, Button, Typography, Grid, Divider } from "@material-ui/core";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import MultiTieredConfiguration from "../MultiTieredConfiguration";
import SingleTieredConfiguration from "../SingleTieredConfiguration";
import CommonImport from "../../../../components/CommonImport";
import useCommonStyles from "../../../../assets/theme/common";
import { NIFTY_PAGE_TYPE, SINGLE_TIER_TYPE, getUniqId, INITIAL_SHIPPING_CONFIG } from "../../niftyConfig";

const configMutators = {
  updateConfig: (args, state, utils) => {
    utils.changeValue(state, "configList", () => args[0]);
  },
};

const importConfig = {
  fileType: "csv",
  specName: "CategoryImportJobSpec",
};

/**
 * Shipping Rate Type Configuration component
 *
 * @returns {React.ReactElement} edit/update shipping rate types
 */
const ShippingConfiguration = () => {
  const history = useHistory();
  const translate = useTranslate();
  const { id } = useParams();
  const commonClasses = useCommonStyles();
  const [urlFlag, setUrlFlag] = useState(false);
  const [record] = useState({
    metric: "",
    singleTieredConfig: {
      rate: "",
      isEnabled: true,
    },
    configList: [{ ...INITIAL_SHIPPING_CONFIG }],
  });

  /**
   * @function saveConfig config save callback
   * @param {object} data updated data
   */
  const saveConfig = (data) => {
    console.log("data");
    console.log(data);
    console.log("id just console added for lint issue fix", id);
  };

  /**
   * @function onAddConfig config save callback
   * @param {object} form parent form reference
   */
  const onAddConfig = (form) => {
    const { configList } = form.getState().values;
    form.mutators.updateConfig([...configList, { ...INITIAL_SHIPPING_CONFIG, configId: getUniqId() }]);
  };

  /**
   * @function onDeleteConfig delete config callback
   * @param {object} form parent form reference
   * @param {object} data delete data
   */
  const onDeleteConfig = (form, data) => {
    const { configList } = form.getState().values;
    const updatedConfig = configList.filter((config) => config.configId !== data.configId);
    form.mutators.updateConfig([...updatedConfig]);
  };

  /**
   *Function to fetch pre-signed url.
   *
   * @function onImport
   */
  const onImport = () => {
    setUrlFlag(true);
  };

  /**
   *Function to reset import
   *
   * @function resetImportHandler
   */
  const resetImportHandler = () => {
    setUrlFlag(false);
  };

  const cancelHandler = useCallback(() => {
    history.goBack();
  }, [history]);

  const configType = useMemo(() => {
    return new URLSearchParams(history.location.search).get("type") || SINGLE_TIER_TYPE;
  }, [history]);

  const breadcrumbs = [
    {
      displayName: translate("carrierShippingPriceMaster.carrier_shipping_price_master"),
      navigateTo: `/nifty/v1/carrier-shipping-master`,
    },
    {
      displayName:
        configType !== SINGLE_TIER_TYPE
          ? translate("carrierShippingPriceMaster.multi_tier_configuration")
          : translate("carrierShippingPriceMaster.single_tier_configuration"),
    },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item container justify="space-between">
        <Grid item className={commonClasses.gridStyle}>
          <Typography variant="h5" color="inherit" className={commonClasses.titleLineHeight}>
            {configType !== SINGLE_TIER_TYPE
              ? translate("carrierShippingPriceMaster.multi_tier_configuration")
              : translate("carrierShippingPriceMaster.single_tier_configuration")}
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={onImport}>
            {translate("import")}
          </Button>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" className={commonClasses.customMargin} />
      <FormWithRedirect
        record={record}
        save={saveConfig}
        mutators={configMutators}
        render={({ handleSubmitWithRedirect, form }) => (
          <>
            {configType !== SINGLE_TIER_TYPE ? (
              <MultiTieredConfiguration
                sourceName="configList"
                addConfig={onAddConfig}
                deleteConfig={onDeleteConfig}
                formRef={form}
              />
            ) : (
              <SingleTieredConfiguration formRef={form} mode={NIFTY_PAGE_TYPE.CREATE} />
            )}
            <Box display="flex" mt="1em">
              <Button variant="outlined" color="default" onClick={cancelHandler}>
                {translate("cancel")}
              </Button>
              <Button variant="contained" color="default" onClick={handleSubmitWithRedirect}>
                {translate("update")}
              </Button>
            </Box>
          </>
        )}
      />
      {urlFlag && (
        <CommonImport
          resource={`${window.REACT_APP_TUSKER_SERVICE}/presignedUrl`}
          payload={importConfig}
          resetImport={resetImportHandler}
          acceptFileType=".csv"
        />
      )}
    </>
  );
};

export default React.memo(ShippingConfiguration);
