import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import { useTranslate } from "react-admin";
import CustomTextInput from "../../../../components/TextInput";
import formatDateValue from "../../../../utils/formatDateTime";
import useStyles from "../../style";

/**
 * @function PromotionAuthor Component used to show the author and created date of Promotion.
 * @param {object} props object which is required dependencies for PromotionAuthor Component.
 * @param {object} props.formValues have the master forms values.
 * @returns {React.ReactElement} react-admin resource.
 */
const PromotionAuthor = (props) => {
  const { formValues } = props;

  const classes = useStyles();
  const translate = useTranslate();

  return (
    <Grid container data-testid="promotion-author">
      <Grid item container alignItems="flex-start" md={10} className={classes.gridGap}>
        <Grid item md={4} className={classes.maxWidthWrap}>
          <CustomTextInput
            label={translate("Created by")}
            variant="standard"
            edit={false}
            value={formValues.createdBy}
          />
        </Grid>
        <Grid item md={4} className={classes.maxWidthWrap}>
          <CustomTextInput
            label={translate("Created date")}
            variant="standard"
            edit={false}
            value={formatDateValue(formValues.createdAt)}
          />
        </Grid>
      </Grid>
      <Grid item container alignItems="flex-start" md={10} className={classes.gridGap}>
        <Grid item md={4} className={classes.maxWidthWrap}>
          <CustomTextInput
            label={translate("Last modified by")}
            variant="standard"
            edit={false}
            value={formValues.updatedBy}
          />
        </Grid>
        <Grid item md={4} className={classes.maxWidthWrap}>
          <CustomTextInput
            label={translate("Last modified date")}
            variant="standard"
            edit={false}
            value={formatDateValue(formValues.updatedAt)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

PromotionAuthor.propTypes = {
  formValues: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PromotionAuthor;
