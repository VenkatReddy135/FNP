import React from "react";
import { Grid, Paper, Tab, Tabs } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import JsonToXml from "../JsonToXml";
import useStyles from "../../assets/theme/common";

/**
 * Component to render between Json and Xml view format.
 *
 * @param {object} props having all the dependencies required for Dev Tools Component.
 * @param {number}props.tabValue tabValue This contains the index value of the tabs by which it decide to show the following section.
 * @param {object}props.initialEntityFormData This contains an Json Object which need to get converted in the JsonToXml Component.
 * @param {number}props.identValue This is used as third argument in Json.Stringify.
 * @param {Function}props.onHandleTabChange This is the callback function which will handles which tab need to be shown
 * @function DevTools
 * @returns {React.ReactElement} react-admin resource.
 */
const DevTools = (props) => {
  const { tabValue, initialEntityFormData, identValue, onHandleTabChange } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const jsonFormatLabel = translate("jsonFormat");
  const xmlFormatLabel = translate("xmlFormat");

  const tabLabels = [
    { label: jsonFormatLabel, value: 0 },
    { label: xmlFormatLabel, value: 1 },
  ];

  /**
   * @function switchHandler function to render the selected Tab view.
   * @param {string} selectedTabValue index value selected by the user.
   * @returns {object} updated view
   */
  const switchHandler = (selectedTabValue) => {
    switch (selectedTabValue) {
      case 0:
        return <pre className={classes.pre}>{JSON.stringify(initialEntityFormData, null, identValue)}</pre>;
      case 1:
        return <JsonToXml jsonObj={initialEntityFormData} />;

      default:
        return null;
    }
  };

  return (
    <Grid container className={classes.gridStyle}>
      <Paper square>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="gray"
          onChange={(e, newValue) => onHandleTabChange(e, newValue)}
        >
          {tabLabels.map((itr) => {
            return <Tab label={itr.label} key={itr.value} value={itr.value} />;
          })}
        </Tabs>
      </Paper>
      <Grid container>{switchHandler(tabValue)}</Grid>
    </Grid>
  );
};

DevTools.propTypes = {
  tabValue: PropTypes.number,
  initialEntityFormData: PropTypes.objectOf,
  identValue: PropTypes.number,
  onHandleTabChange: PropTypes.func,
};

DevTools.defaultProps = {
  initialEntityFormData: {},
  tabValue: 0,
  identValue: null,
  onHandleTabChange: () => {},
};

export default DevTools;
