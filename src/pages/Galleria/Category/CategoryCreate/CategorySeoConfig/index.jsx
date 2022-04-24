/* eslint-disable react/destructuring-assignment */
import React, { useState } from "react";
import { SimpleForm, Button, SelectInput, useTranslate, required } from "react-admin";
import PropTypes from "prop-types";
import { Grid, Typography, makeStyles, TextField } from "@material-ui/core";
import { manageContentLink } from "../../../../../config/GlobalConfig";

const requiredValidate = [required()];
const useStyles = makeStyles(() => ({
  canUrl: {
    width: "600px",
  },
  manageBtn: {
    color: "#FF9212",
  },
}));

/**
 * Component for Category SEO component contains Button to open a new tab.
 *
 * @param {*}  props for category create SEO Config
 * @returns {React.ReactElement} returns a Category SEO component
 */
const CategorySEOConfig = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const { categoryUrl } = props;
  const { canonicalData } = props;
  const [selectedCanonical, updateSelectedCanonical] = useState({
    type: Object.keys(canonicalData).length > 0 ? canonicalData.type : "REFERENCE",
    url: categoryUrl ? `https://www.${categoryUrl}` : canonicalData.url,
  });
  const canonicalOptions = [
    { id: "SELF", name: "SELF" },
    { id: "REFERENCE", name: "REFERENCE" },
  ];

  /**
   * Function to open new tab with fnp.com
   *
   * @function redirect
   */
  const redirect = () => {
    window.open(manageContentLink, "_blank");
  };
  props.selectedCanTypeUrl(selectedCanonical);
  return (
    <div>
      <SimpleForm initialValues={null} toolbar={<></>}>
        <Grid item container direction="row" alignItems="flex-start" justify="space-between" md={6}>
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <SelectInput
              source="canonicalTyp"
              choices={canonicalOptions}
              validate={requiredValidate}
              label={translate("canonical_type")}
              data-at-id="CreatecanonicalTyp"
              variant="standard"
              initialValue={selectedCanonical.type}
              onChange={(event) => {
                updateSelectedCanonical({ ...selectedCanonical, type: event.target.value });
              }}
            />
          </Grid>
          <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
            <TextField
              label={translate("canonical_url")}
              data-at-id="CreatecanonicalUrl"
              variant="standard"
              required
              value={selectedCanonical.url}
              className={classes.canUrl}
              onChange={(event) => {
                updateSelectedCanonical({ ...selectedCanonical, url: event.target.value });
              }}
            />
          </Grid>
        </Grid>

        <Typography>{translate("category_seo_msg")}</Typography>
        <Button
          variant="outlined"
          label={translate("manage_cont")}
          className={classes.manageBtn}
          data-at-id="CreateContentClk"
          onClick={redirect}
        />
      </SimpleForm>
    </div>
  );
};
CategorySEOConfig.propTypes = {
  categoryUrl: PropTypes.string.isRequired,
  canonicalData: PropTypes.objectOf(PropTypes.any),
  selectedCanTypeUrl: PropTypes.func,
};
CategorySEOConfig.defaultProps = {
  canonicalData: {},
  selectedCanTypeUrl: () => {},
};

export default React.memo(CategorySEOConfig);
