import React from "react";
import PropTypes from "prop-types";
import { Button, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Link } from "react-router-dom";
import MenuItemsDialog from "../MenuItemsDialog";

/**
 * makeStyles hook of material-ui to apply style for status component
 *
 * @function
 * @name useStyles
 */
const useStyles = makeStyles({
  buttonStyle: {
    minWidth: "0px !important",
    textAlign: "left",
    height: "44px",
    padding: "0px",
    paddingTop: "9px",
    marginLeft: "-8px",
    "&:hover": {
      background: "#DBDADA",
    },
    "&.MuiButton-root": {
      minWidth: "0px",
    },
  },
  linkColor: {
    color: "#2179D0",
  },
  buttonWrapper: {
    display: "flex",
    alignItems: "center",
  },
});

/**
 * Component for Kebab Menu Icon with Link, on clicking which opens a dialog containing menu item links
 *
 * @param {object} props contains data of the grid row
 * @returns {React.ReactElement} returns Kebab Menu Icon with a Link
 */
const KebabMenuWithLink = (props) => {
  const {
    record,
    configurationForKebabMenu,
    resource,
    tabPath,
    onClick,
    source,
    isLink,
    externalComponent,
    categoryId,
    isAnchorLink,
    queryValue,
    isCustomDelete,
    deleteEntityHandler,
    displayText,
    onLinkClick,
  } = props;
  /**
   * @function getRowValue function to dynamically fetch value to be displayed with kebab menu from the record
   *
   * @param {object} recordObj the record data that we get from the API response
   * @param {object} sourceData contains the source value that gets passed from the config object for the grid
   * @returns {string} returns the value to be displayed in link/textfield of KebabMenuWithLink component
   */
  const getRowValue = (recordObj, sourceData) => {
    return sourceData.split(".").reduce((acc, part) => acc && acc[part], recordObj);
  };
  const rowId = record.id;
  const rowValue = getRowValue(record, source);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  let updatedRowVal = rowValue;
  if (isLink) {
    updatedRowVal = (
      <Link
        to={{
          pathname: `/${resource}/${rowId}${tabPath}`,
          isEditable: false,
          id: record.id,
          search: queryValue,
        }}
        data-at-id={`${rowId}_show`}
        className={isAnchorLink ? classes.linkColor : "MuiTypography-root MuiTypography-body2"}
        onClick={(event) => onLinkClick(event, record)}
      >
        {displayText || rowValue}
      </Link>
    );
  } else if (externalComponent) {
    updatedRowVal = externalComponent(record);
  }
  /**
   * Function to update the state for closing Kebab menu dialog
   *
   * @function handleClose
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Function to update the state of current clicked Kebab menu element
   *
   * @function handleClick
   * @param  {string} event object details related to button event
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className={classes.buttonWrapper}>
      {configurationForKebabMenu.length > 0 && (
        <Button
          data-at-id="id"
          aria-controls="customized-menu"
          aria-haspopup="true"
          className={classes.buttonStyle}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </Button>
      )}
      <span className="MuiTypography-root MuiTypography-body2">{updatedRowVal}</span>
      <MenuItemsDialog
        record={record}
        categoryId={categoryId}
        optionsList={configurationForKebabMenu}
        anchorEl={anchorEl}
        rowId={rowId}
        resource={resource}
        tabPath={tabPath}
        queryValue={queryValue}
        setCloseCallback={handleClose}
        onClick={() => onClick()}
        isCustomDelete={isCustomDelete}
        deleteEntityHandler={deleteEntityHandler}
      />
    </div>
  );
};

KebabMenuWithLink.propTypes = {
  record: PropTypes.objectOf(PropTypes.any),
  configurationForKebabMenu: PropTypes.arrayOf(PropTypes.object).isRequired,
  resource: PropTypes.string,
  tabPath: PropTypes.string,
  queryValue: PropTypes.string,
  onClick: PropTypes.func,
  source: PropTypes.string.isRequired,
  isLink: PropTypes.bool.isRequired,
  isCustomDelete: PropTypes.string,
  deleteEntityHandler: PropTypes.func,
  categoryId: PropTypes.string,
  externalComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  isAnchorLink: PropTypes.bool,
  displayText: PropTypes.string,
  onLinkClick: PropTypes.func,
};

KebabMenuWithLink.defaultProps = {
  record: {},
  categoryId: "",
  onClick: null,
  resource: "",
  externalComponent: false,
  isAnchorLink: false,
  queryValue: "",
  displayText: "",
  isCustomDelete: "",
  deleteEntityHandler: () => {},
  tabPath: "",
  onLinkClick: () => {},
};

export default KebabMenuWithLink;
