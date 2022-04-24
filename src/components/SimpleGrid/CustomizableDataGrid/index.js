/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState, cloneElement } from "react";
import PropTypes from "prop-types";
import { Datagrid, useTranslate, useListContext } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import get from "lodash/get";
import ColumnIcon from "@material-ui/icons/ViewColumn";
import Button from "@material-ui/core/Button";
import SelectionDialog from "./SelectionDialog";
import LocalStorage from "../../../utils/localstorage";
import { COCKPIT_SELECT_API } from "../../../config/GlobalConfig";

/**
 * makeStyles hook of material-ui to apply style for Reset form
 *
 *  @function useStyles
 */
const useStyles = makeStyles({
  containerWrapper: {
    float: "right",
    marginRight: "1rem",
    marginBottom: "1rem",
    marginTop: "-3rem",
    display: "flex",
    alignItems: "center",
    flexDirection: "row-reverse",
  },
});

/**
 * Array to selecttion function
 *
 * @param {Array} values -values to iterate
 * @returns {object} -return an object with key and value pair
 */
const arrayToSelection = (values) =>
  values.reduce((selectionAcc, columnName) => {
    selectionAcc[columnName] = true;
    return selectionAcc;
  }, {});

/**
 * Extract column name function
 *
 * @param {object} propsData props
 * @returns {object} column name
 */
const getColumnNames = (propsData) => {
  const { children } = propsData;
  return filter(React.Children.map(children, (field) => get(field, ["props", "source"])));
};

// CustomizableDatagrid allows to show/hide columns dynamically
// the preferences are stored in local storage

let resourceKey = null;
/**
 * Data Grid function
 *
 * @param {*} props -values to iterate
 * @returns {React.ReactElement} Data Grid with column name.
 */
const CustomizableDatagrid = (props) => {
  const translate = useTranslate();

  /**
   * Array to selecttion function
   *
   * @returns {object} Object with selected field.
   */
  const getInitialSelection = () => {
    const { defaultColumns, resource, storage, location } = props;
    if (resource.indexOf(window.REACT_APP_COCKPIT_SERVICE) !== -1 && resource.indexOf(COCKPIT_SELECT_API) !== -1) {
      resourceKey = resource + (location?.search || "");
    } else {
      resourceKey = resource;
    }

    const previousSelection = storage.get(resourceKey);

    // if we have a previously stored value, let's return it
    if (!isEmpty(previousSelection)) {
      return previousSelection;
    }

    // if defaultColumns are set let's return them
    if (!isEmpty(defaultColumns)) {
      return arrayToSelection(defaultColumns);
    }

    // otherwise we fallback on the default behaviour : display all columns
    return arrayToSelection(getColumnNames(props));
  };
  const [modalOpened, setModalOpened] = useState(false);
  const [selection, setSelection] = useState(getInitialSelection());
  const { resource, displayedFilters, filterValues, showFilter } = useListContext();
  /**
   * Array to selection function
   *
   * @returns {object} Object with selected field.
   */
  const getColumnLabels = () => {
    const { children } = props;
    return filter(
      React.Children.map(
        children,
        (field) =>
          field && {
            source: get(field, ["props", "source"]),
            label: get(field, ["props", "label"]),
            type: get(field, ["props", "type"]),
          },
      ),
      (item) => item && item.source,
    );
  };
  // updates the storage with the internal state value
  /**
   * Update data in localstore funciton
   *
   * @returns {undefined} returning undefined
   */
  const updateStorage = () => {
    props.storage.set(resourceKey, selection);
  };
  useEffect(() => {
    updateStorage();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [selection]);
  /**
   * Function to toggleColumns based on selected value
   *
   * @param {string} columnName column name
   */
  const toggleColumn = (columnName) => {
    const previousSelection = selection;
    const selectionTemp = {
      ...previousSelection,
      [columnName]: !previousSelection[columnName],
    };
    setSelection(selectionTemp);
  };
  /**
   * Function to update mdoal state
   *
   * @returns {Function} returning undefined
   */
  const handleOpen = () => setModalOpened(true);
  /**
   * Function to update modal state
   *
   * @returns {undefined} returning undefined
   */
  const handleClose = () => setModalOpened(false);
  const { children, rowStyleFunc, defaultColumns, additionalLink, filters, ...rest } = props;
  /**
   * Function to render the children
   *
   * @param {React.ReactElement} child react component
   * @returns {React.ReactElement} returning react element
   */
  const renderChild = (child) => {
    const source = get(child, ["props", "source"]);
    // Show children without source, or children explicitly visible
    if (!source || selection[source]) {
      return React.cloneElement(child, {});
    }

    return null;
  };

  const classes = useStyles();

  return (
    <div>
      <div className={classes.containerWrapper}>
        <Button
          title={translate("select_configuration_columns")}
          variant="outlined"
          mini
          aria-label="add"
          onClick={handleOpen}
        >
          <ColumnIcon />
        </Button>
        {filters &&
          cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: "button",
          })}
        {additionalLink}
      </div>
      {modalOpened && (
        <SelectionDialog
          selection={selection}
          columns={getColumnLabels()}
          onColumnClicked={toggleColumn}
          onClose={handleClose}
        />
      )}
      <Datagrid {...rest} rowStyle={rowStyleFunc}>
        {React.Children.map(children, renderChild)}
      </Datagrid>
    </div>
  );
};

CustomizableDatagrid.propTypes = {
  defaultColumns: PropTypes.arrayOf(PropTypes.string),
  storage: PropTypes.shape({
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
  }),
  resource: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.object),
  rowStyleFunc: PropTypes.func,
  location: PropTypes.shape({
    hash: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.string || PropTypes.objectOf(PropTypes.any),
  }),
  additionalLink: PropTypes.element,
  filters: PropTypes.objectOf(PropTypes.any),
};

CustomizableDatagrid.defaultProps = {
  defaultColumns: [],
  storage: LocalStorage,
  resource: "",
  children: [],
  rowStyleFunc: () => {},
  location: {},
  additionalLink: <></>,
  filters: null,
};

export default CustomizableDatagrid;
