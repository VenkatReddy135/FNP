/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";
import { useTranslate } from "react-admin";
import PropTypes from "prop-types";
import AutoComplete from "../../../../../components/AutoComplete";

const useStyles = makeStyles(() => ({
  catBasic: {
    width: "100%",
  },
  gapParent: {
    gap: "60px",
    display: "flex",
  },
}));
/**
 * Component for taxonomy details UI.
 *
 * @param {*} props props for category create Taxonomy
 * @returns {React.ReactElement} returns a Category taxonomy details UI component
 */
const CategoryTaxonomyUI = (props) => {
  const {
    domain,
    geo,
    party,
    product,
    occassion,
    city,
    recipient,
    taxonomyFlag,
    taxonomyObj,
    handleInputChange,
    updateTaxonomy,
    errorMsg,
  } = props;
  const classes = useStyles();
  const translate = useTranslate();
  return (
    <div>
      <Typography>{translate("taxonomy_details")}</Typography>
      <Grid
        className={classes.gapParent}
        container
        direction="row"
        alignItems="flex-start"
        justify="space-between"
        xs={12}
      >
        <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs={3}>
          <AutoComplete
            optionsFromParentComponent
            onChangeFromParentComponent
            onOpen
            required
            optionData={domain}
            label={translate("category_domain")}
            labelName="tagName"
            dataId="categoryDomain"
            value={taxonomyFlag ? taxonomyObj?.taxonomy?.domain : null}
            onInputChangeCall={(event, newInputValue) => {
              handleInputChange(newInputValue, "D");
            }}
            onOpenCall={(event) => handleInputChange(event.target.value, "D")}
            autoCompleteClass={classes.catBasic}
            onChange={(e, newValue) => {
              updateTaxonomy(e, newValue, "D", "domain");
            }}
            errorMsg={errorMsg.domain}
          />
        </Grid>
        <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
          <AutoComplete
            optionsFromParentComponent
            onChangeFromParentComponent
            onOpen
            required
            optionData={geo}
            label={translate("category_geography")}
            labelName="tagName"
            dataId="categoryGeography"
            value={taxonomyFlag ? taxonomyObj?.taxonomy?.geography : null}
            onInputChangeCall={(event, newInputValue) => {
              handleInputChange(newInputValue, "G");
            }}
            onOpenCall={(event) => handleInputChange(event.target.value, "G")}
            autoCompleteClass={classes.catBasic}
            onChange={(e, newValue) => {
              updateTaxonomy(e, newValue, "G", "geography");
            }}
            errorMsg={errorMsg.geo}
          />
        </Grid>
        <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
          <AutoComplete
            optionsFromParentComponent
            onChangeFromParentComponent
            onOpen
            optionData={party}
            label={translate("category_party")}
            labelName="tagName"
            dataId="categoryParty"
            value={taxonomyFlag ? taxonomyObj?.taxonomy?.party : null}
            onInputChangeCall={(event, newInputValue) => {
              handleInputChange(newInputValue, "P");
            }}
            onOpenCall={(event) => handleInputChange(event.target.value, "P")}
            autoCompleteClass={classes.catBasic}
            onChange={(e, newValue) => {
              updateTaxonomy(e, newValue, "P", "party");
            }}
          />
        </Grid>
        <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
          <AutoComplete
            optionsFromParentComponent
            onChangeFromParentComponent
            onOpen
            required={taxonomyObj.categoryClassification === "url"}
            optionData={product}
            label={translate("category_product")}
            labelName="tagName"
            dataId="categoryProduct"
            value={taxonomyFlag ? taxonomyObj?.taxonomy?.productType : null}
            onInputChangeCall={(event, newInputValue) => {
              handleInputChange(newInputValue, "PT");
            }}
            onOpenCall={(event) => handleInputChange(event.target.value, "PT")}
            autoCompleteClass={classes.catBasic}
            onChange={(e, newValue) => {
              updateTaxonomy(e, newValue, "PT", "productType");
            }}
            errorMsg={taxonomyObj.categoryClassification === "url" ? errorMsg.product : false}
          />
        </Grid>
      </Grid>
      <Grid
        className={classes.gapParent}
        container
        direction="row"
        alignItems="flex-start"
        justify="space-between"
        xs={9}
      >
        <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs={4}>
          <AutoComplete
            optionsFromParentComponent
            onChangeFromParentComponent
            onOpen
            optionData={occassion}
            label={translate("category_occ")}
            labelName="tagName"
            dataId="categoryOcc"
            value={taxonomyFlag ? taxonomyObj?.taxonomy?.occasion : null}
            onInputChangeCall={(event, newInputValue) => {
              handleInputChange(newInputValue, "O");
            }}
            onOpenCall={(event) => handleInputChange(event.target.value, "O")}
            autoCompleteClass={classes.catBasic}
            onChange={(e, newValue) => {
              updateTaxonomy(e, newValue, "O", "occasion");
            }}
          />
        </Grid>
        <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
          <AutoComplete
            optionsFromParentComponent
            onChangeFromParentComponent
            onOpen
            optionData={city}
            label={translate("category_city")}
            labelName="tagName"
            dataId="categoryCity"
            value={taxonomyFlag ? taxonomyObj?.taxonomy?.city : null}
            onInputChangeCall={(event, newInputValue) => {
              handleInputChange(newInputValue, "C");
            }}
            onOpenCall={(event) => handleInputChange(event.target.value, "C")}
            autoCompleteClass={classes.catBasic}
            onChange={(e, newValue) => {
              updateTaxonomy(e, newValue, "C", "city");
            }}
          />
        </Grid>
        <Grid item direction="column" justify="flex-start" alignItems="flex-start" xs>
          <AutoComplete
            optionsFromParentComponent
            onChangeFromParentComponent
            onOpen
            optionData={recipient}
            label={translate("category_recipient")}
            labelName="tagName"
            dataId="categoryRecipient"
            value={taxonomyFlag ? taxonomyObj?.taxonomy?.recipient : null}
            onInputChangeCall={(event, newInputValue) => {
              handleInputChange(newInputValue, "R");
            }}
            onOpenCall={(event) => handleInputChange(event.target.value, "R")}
            autoCompleteClass={classes.catBasic}
            onChange={(e, newValue) => {
              updateTaxonomy(e, newValue, "R", "recipient");
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

CategoryTaxonomyUI.propTypes = {
  domain: PropTypes.objectOf(PropTypes.any).isRequired,
  geo: PropTypes.objectOf(PropTypes.any).isRequired,
  party: PropTypes.objectOf(PropTypes.any).isRequired,
  product: PropTypes.objectOf(PropTypes.any).isRequired,
  occassion: PropTypes.objectOf(PropTypes.any).isRequired,
  city: PropTypes.objectOf(PropTypes.any).isRequired,
  recipient: PropTypes.objectOf(PropTypes.any).isRequired,
  taxonomyFlag: PropTypes.bool.isRequired,
  taxonomyObj: PropTypes.objectOf(PropTypes.any).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  updateTaxonomy: PropTypes.func.isRequired,
  errorMsg: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(CategoryTaxonomyUI);
