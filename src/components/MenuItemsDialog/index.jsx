import React from "react";
import PropTypes from "prop-types";
import Menu from "@material-ui/core/Menu";
import { MenuItemLink } from "react-admin";
import useStyles from "../../assets/theme/common";
/**
 * Component for Kebab Menu Dialog contains list of menu items link
 *
 * @param {object} props having dependencies for this component
 * @param {object} props.record holds the data of menu Items
 * @param {Array}props.optionsList holds the option list of menu Items
 * @param {object}props.anchorEl send as property to menu
 * @param {string}props.rowId holds the rowId of menu Item
 * @param {Function} props.setCloseCallback callback function used to close the modal
 * @param {string} props.resource holds the resource value
 * @param {string} props.queryValue holds the query Value
 * @returns {React.ReactElement} returns a React Component for Kebab Menu Dialog
 */
const MenuItemsDialog = ({ record, optionsList, anchorEl, rowId, setCloseCallback, resource, queryValue }) => {
  const open = Boolean(anchorEl);
  const classes = useStyles();

  return (
    <>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        className={classes.menuItemDialog}
        keepMounted
        open={open}
        onClose={setCloseCallback}
        PaperProps={{
          style: {
            maxHeight: "auto",
            width: "auto",
            minWidth: "20ch",
          },
        }}
      >
        {optionsList.map((option) => {
          let path;
          if (option.type === "Delete" || option.noRedirect) {
            path = "";
          } else if (option.customUrl) {
            path = `/${option.customUrl}/${rowId}`;
          } else {
            path = `/${resource}/${rowId}${option.routeType}`;
          }
          return (
            <MenuItemLink
              to={{
                pathname: path,
                isEditable: option.isEditable,
                contentType: record.contentTypeResponse ? record.contentTypeResponse.contentTypeName : null,
                search: queryValue,
              }}
              key={option.id}
              data-at-id={`${option.type}_${rowId}`}
              primaryText={option.type}
              leftIcon={option.leftIcon}
              onClick={option.onClick ? () => option.onClick(rowId) : null}
            />
          );
        })}
      </Menu>
    </>
  );
};

MenuItemsDialog.propTypes = {
  anchorEl: PropTypes.objectOf(PropTypes.object),
  optionsList: PropTypes.arrayOf(PropTypes.object),
  rowId: PropTypes.string,
  queryValue: PropTypes.string,
  resource: PropTypes.string,
  setCloseCallback: PropTypes.func,
  record: PropTypes.objectOf(PropTypes.any),
};

MenuItemsDialog.defaultProps = {
  anchorEl: {},
  optionsList: [],
  rowId: "",
  queryValue: "",
  resource: "",
  setCloseCallback: () => {},
  record: {},
};

export default React.memo(MenuItemsDialog);
