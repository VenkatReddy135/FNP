import PropTypes from "prop-types";
import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { useTranslate } from "react-admin";
import { getFormattedDateValue } from "../../../../../utils/formatDateTime";
import CustomViewUI from "../../../../../components/CustomViewUI/CustomViewUI";
import useStyles from "../../../../../assets/theme/common";

/**
 * Category Taxonomy Page to display Taxonomy details for a category.
 *
 * @param {object} props contains object for taxonomy
 * @returns {React.ReactElement} returns JSX element for taxonomy details
 */
const CategoryTaxonomy = (props) => {
  const { category } = props;
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <>
      <Grid className={classes.headerClass}>
        <Typography variant="subtitle1">{translate("taxonomy_details")}</Typography>
      </Grid>
      <Grid className={classes.customMargin} container>
        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("category_domain_name")}
          value={category.taxonomy && category.taxonomy.domain ? category.taxonomy.domain.tagName : null}
        />
        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("category_geography")}
          value={category.taxonomy && category.taxonomy.geography ? category.taxonomy.geography.tagName : null}
        />
        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("category_party")}
          value={category.taxonomy && category.taxonomy.party ? category.taxonomy.party.tagName : null}
        />
        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("category_product")}
          value={category.taxonomy && category.taxonomy.productType ? category.taxonomy.productType.tagName : null}
        />
      </Grid>
      <Grid className={classes.bottomMargin} container>
        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("category_occ")}
          value={category.taxonomy && category.taxonomy.occasion ? category.taxonomy.occasion.tagName : null}
        />
        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("category_city")}
          value={category.taxonomy && category.taxonomy.city ? category.taxonomy.city.tagName : null}
        />
        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("category_recipient")}
          value={category.taxonomy && category.taxonomy.recipient ? category.taxonomy.recipient.tagName : null}
        />
      </Grid>
      <Grid className={classes.customMargin} container>
        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("created_by")}
          value={category.createdByName}
        />
        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("created_date")}
          value={category.createdAt ? getFormattedDateValue(new Date(category.createdAt)) : ""}
        />

        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("updated_by")}
          value={category.updatedByName}
        />
        <CustomViewUI
          gridSize={{ xs: 12, sm: 12, md: 3 }}
          label={translate("last_modified_date")}
          value={category.updatedAt ? getFormattedDateValue(new Date(category.updatedAt)) : ""}
        />
      </Grid>
    </>
  );
};

CategoryTaxonomy.propTypes = {
  category: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(CategoryTaxonomy);
