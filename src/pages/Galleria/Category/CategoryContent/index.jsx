import React from "react";
import { Button, useTranslate } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { manageContentLink } from "../../../../config/GlobalConfig";

const useStyles = makeStyles({
  typography: {
    marginBottom: "30px",
    marginTop: "30px",
  },
});

/**
 * Component for content Management contains Button to open a new tab.
 *
 * @returns {React.ReactElement} returns a content Management List component
 */
const CategoryContent = () => {
  const classes = useStyles();
  const translate = useTranslate();
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
      <Typography className={classes.typography} variant="subtitle2">
        {translate("content_message")}
      </Typography>
      <Button variant="outlined" label="Manage Content" onClick={redirect} />
    </div>
  );
};

export default CategoryContent;
