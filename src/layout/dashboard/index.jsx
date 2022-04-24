import { Card, CardContent, makeStyles } from "@material-ui/core";
import React from "react";
import { Title, useTranslate } from "react-admin";
/**
 * makeStyles hook of material-ui to apply style for status component
 *
 * @function
 * @name useStyles
 */
const useStyles = makeStyles({
  paddingCard: {
    padding: "16px",
  },
});

/**
 * Dashboard for Zeus
 *
 * @returns {React.ReactElement} A React element.
 */
const Dashboard = () => {
  const translate = useTranslate();
  const classes = useStyles();
  return (
    <Card style={{ margin: "2%" }}>
      <Title title={translate("dashboardTitle")} />
      <CardContent className={classes.paddingCard}>{translate("dashboardContent")}</CardContent>
    </Card>
  );
};

export default Dashboard;
