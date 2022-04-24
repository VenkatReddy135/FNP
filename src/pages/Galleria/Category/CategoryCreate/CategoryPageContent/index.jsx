import { Typography, makeStyles } from "@material-ui/core";
import React from "react";
import { useTranslate, Button } from "react-admin";
import { manageContentLink } from "../../../../../config/GlobalConfig";

const useStyles = makeStyles(() => ({
  manageBtn: {
    marginBottom: "30px",
    marginTop: "20px",
  },
}));
/**
 * Component for content Management contains Button to open a new tab.
 *
 * @returns {React.ReactElement} returns a content Management List component
 */
const CategoryContent = () => {
  const translate = useTranslate();
  const classes = useStyles();
  /**
   * Function to open new tab with fnp.com
   *
   * @function redirect
   */
  const redirect = () => {
    window.open(manageContentLink, "_blank");
  };
  return (
    <div>
      <Typography>{translate("category_content_msg")}</Typography>
      <Button
        variant="outlined"
        label={translate("manage_cont")}
        className={classes.manageBtn}
        data-at-id="CreateContentClk"
        onClick={redirect}
      />
    </div>
  );
};

export default CategoryContent;
