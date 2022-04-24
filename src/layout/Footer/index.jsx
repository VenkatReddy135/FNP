import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useTranslate } from "react-admin";

/**
 *
 * useStyles function to apply material-ui style on Footer component
 *
 * @function useStyles
 */
const useStyles = makeStyles({
  paper: {
    width: "100%",
    backgroundColor: "#555555",
    textAlign: "center",
    padding: "29px 0",
    bottom: 0,
  },
  copyright: {
    color: "#A7A7A9",
    fontSize: "13px",
  },
});

/**
 * Component for Footer
 *
 * @returns  {React.createElement} Footer.jsx
 */
const Footer = () => {
  const classes = useStyles();
  const translate = useTranslate();
  return (
    <Paper className={classes.paper} elevation={0} square>
      <Typography className={classes.copyright}>{translate("copyright")}</Typography>
    </Paper>
  );
};

export default Footer;
