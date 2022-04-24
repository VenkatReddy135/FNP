import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AppBar, Tabs, Tab, Box } from "@material-ui/core";
import { useTranslate } from "react-admin";
import useStyles from "./ConfigurationFormStyles";
import Weightage from "../Weightage";
import Capping from "../Capping";
import LookBackWindow from "../LookBackWindow";

/**
 * ConfigurationForm component for displaying weight age, Capping and Look back window
 *
 * @function ConfigurationForm
 * @param {object} props contains data related to selected domain
 * @returns {React.ReactElement} Indexable Attributes Page.
 */
const ConfigurationForm = (props) => {
  const { domain } = props;
  const translate = useTranslate();
  const [tabValue, setTabValue] = useState(0);
  const classes = useStyles();

  // This function is added to set first tab active when user change the domain
  useEffect(() => {
    setTabValue(0);
  }, [domain]);

  const TABS = [
    { id: 0, label: translate("tabs.weightage"), name: "weightage" },
    { id: 1, label: translate("tabs.capping"), name: "capping" },
    { id: 2, label: translate("tabs.look_back_window"), name: "lookBackWindow" },
  ];

  const componentMapping = {
    weightage: <Weightage domain={domain} />,
    capping: <Capping domain={domain} />,
    lookBackWindow: <LookBackWindow domain={domain} />,
  };

  /**
   * To update the state which tab is clicked
   *
   * @name handleTabChange
   * @param {object} _event event data
   * @param {number} newValue Clicked value index
   */
  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  const {
    root,
    tabsMinHeight,
    customTabsIndicator,
    tabRoot,
    activeTabColor,
    marginRight5,
    tabWrapper,
    tabFlexContainer,
    firstTab,
  } = classes;
  return (
    <div className={root}>
      <AppBar
        position="static"
        color="default"
        classes={{
          root: tabWrapper,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="Configuration form"
          classes={{
            root: tabsMinHeight,
            indicator: customTabsIndicator,
            flexContainer: tabFlexContainer,
          }}
        >
          {TABS.map(({ label }, index) => (
            <Tab
              classes={{
                root: `${tabRoot} ${index !== TABS.length - 1 ? marginRight5 : ""} ${index === 0 ? firstTab : ""}`,
                selected: activeTabColor,
              }}
              key={label}
              label={label}
            />
          ))}
        </Tabs>
      </AppBar>
      {TABS.map(({ name, id }) => (
        <TabPanel value={tabValue} key={id} index={id}>
          {componentMapping[name]}
        </TabPanel>
      ))}
    </div>
  );
};

ConfigurationForm.propTypes = {
  domain: PropTypes.string.isRequired,
};

/**
 * This function is used to generate the content of the tab
 *
 * @name TabPanel
 * @param {*} props props of the parent
 * @returns {React.ReactElement} for tab content.
 */
function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={index} aria-labelledby={index}>
      {value === index && (
        <Box p={1}>
          {/* P will create paragraph tag under box and will add padding 1 in the box */}
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.objectOf(PropTypes.any).isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default ConfigurationForm;
