import { Checkbox, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiListItemIcon-root": {
      minWidth: "35px",
    },
    "& .MuiListItem-gutters": {
      paddingLeft: 0,
    },
    "& .MuiIconButton-label": {
      color: "#009d43",
    },
    "& .PrivateSwitchBase-root-127": {
      paddingLeft: 0,
    },
    width: "100%",
    maxWidth: "360px",
  },
}));

/**
 * Derived categories list component
 *
 * @param {*} props array of object expected to display checklist
 * @returns {React.ReactElement} list of items with checkboxes and select all option
 */
const DerivedCategoryList = (props) => {
  const classes = useStyles();
  const { derivedCategories } = props;
  const [checkedItems, setCheckedItems] = useState(() => {
    const items = derivedCategories.map((e) => {
      e.checked = false;
      return e;
    });
    return items;
  });
  /**
   * handle change event for checkboxes values
   *
   * @param {*} e  of checkbox element
   */
  const handleChange = (e) => {
    const checkBoxName = e.target.name;
    const isChecked = e.target.checked;
    let newCheckedItems = [...checkedItems];

    if (checkBoxName === "selectAll") {
      newCheckedItems = checkedItems.map((element) => {
        const updatedObj = {
          checked: isChecked,
          categoryName: element.categoryName,
          categoryId: element.categoryId,
        };
        return updatedObj;
      });
    } else {
      const elementsIndex = checkedItems.findIndex((item) => item.categoryId === checkBoxName);
      newCheckedItems[elementsIndex] = { ...newCheckedItems[elementsIndex], checked: isChecked };
    }
    setCheckedItems(newCheckedItems);
    props.getSelectedCategories(newCheckedItems);
  };

  const isAllSelected =
    checkedItems.length > 0 ? checkedItems.findIndex((item) => item.checked === false) === -1 : false;

  return (
    <List className={classes.root}>
      <ListItem dense button>
        <ListItemIcon>
          <Checkbox
            color="default"
            tabIndex={-1}
            disableRipple
            name="selectAll"
            onChange={(e) => handleChange(e)}
            checked={isAllSelected}
          />
        </ListItemIcon>
        <ListItemText primary="Select All Categories" />
      </ListItem>
      {checkedItems.map((element) => {
        const labelId = `checkbox-list-label-${element.categoryId}`;
        return (
          <ListItem key={element.categoryId} dense button>
            <ListItemIcon>
              <Checkbox
                color="default"
                name={element.categoryId}
                tabIndex={-1}
                disableRipple
                checked={element.checked}
                onChange={(e) => handleChange(e)}
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={element.categoryName} disableTypography={false} />
          </ListItem>
        );
      })}
    </List>
  );
};

export default DerivedCategoryList;

DerivedCategoryList.propTypes = {
  derivedCategories: PropTypes.instanceOf(Array),
  getSelectedCategories: PropTypes.func,
};

DerivedCategoryList.defaultProps = {
  derivedCategories: [],
  getSelectedCategories: () => {},
};
