/* eslint-disable react/jsx-props-no-spreading */

import PropTypes from "prop-types";
import React from "react";
import {
  List,
  DateField,
  BooleanField,
  NumberField,
  BooleanInput,
  ChipField,
  UrlField,
  SimpleForm,
  TextInput,
  EmailField,
  ResourceContextProvider,
  Pagination,
  PaginationActions,
  FunctionField,
  useTranslate,
} from "react-admin";
import { Typography, Divider, Grid } from "@material-ui/core";
import CustomizableDatagrid from "./CustomizableDataGrid";
import GridActions from "../GridActionButtons";
import KebabMenuWithLink from "../KebabMenuWithLink";
import TextField from "../TextField";
import GridFilters from "../GridFilters";
import useStyles from "../../assets/theme/common";
import SwitchComp from "../switch";
import Status from "../WorkFlowStatus";
import TooltipTextField from "../TooltipTextField";
import CustomSourceData from "./SourceField/CustomSourceData";
import CustomDateField from "../DateFieldConversion";
import UrlComponent from "../UrlComponent";
import TextWithJson from "../TextWithJson";
import EmptyPage from "../EmptyPage";
import StatusField from "../StatusField";
import StarRating from "./StarRating";
import ActionButton from "../../pages/Moody/ActionButton";
import LinkButton from "../LinkButton";
import ExportDropdown from "../ExportDropdown";
import CustomGridInputField from "../CustomGridInputField";
import { defaultRowPerPageOption } from "../../config/GlobalConfig";

const componentsMap = {
  ActionButton,
  TextField,
  DateField,
  BooleanField,
  BooleanInput,
  NumberField,
  ChipField,
  UrlField,
  SimpleForm,
  TextInput,
  EmailField,
  KebabMenuWithLink,
  SwitchComp,
  CustomDateField,
  CustomSourceData,
  Status,
  TooltipTextField,
  StatusField,
  CustomGridInputField,
  UrlComponent,
  TextWithJson,
  StarRating,
  LinkButton,
  ExportDropdown,
  FunctionField,
};

/**
 * Component for Custom Pagination Actions
 *
 * @param {object} props all the props required by Simple Grid
 * @returns {React.ReactElement} returns a React component for Custom Pagination
 */
const CustomPaginationActions = (props) => <PaginationActions {...props} color="secondary" />;

/**
 * Component for Custom Pagination
 *
 * @param {object} props all the props required by Simple Grid
 * @returns {React.ReactElement} returns a React component for Simple Grid
 */
const CustomPagination = (props) => <Pagination {...props} ActionsComponent={CustomPaginationActions} />;

/**
 * Component for Grid Filters contains list of all the filters you want to see in the grid
 *
 * @param {*} props all the props required by Simple Grid
 * @returns {React.ReactElement} returns a React component for Simple Grid
 */
const SimpleGrid = ({
  configurationForGrid,
  actionButtonsForGrid,
  actionButtonsForEmptyGrid,
  gridTitle,
  searchLabel,
  bulkActionButtons,
  sortField,
  resource,
  basePath,
  filters,
  getFilter,
  showAddFilterButton,
  isSearchEnabled,
  clearSearchFilter,
  resetClearSearchFilter,
  rowStyleFunc,
  additionalLink,
  rowsPerPageOptions,
  limit,
  ...props
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  const NO_RESULTS_FOUND_MESSAGE = translate("no_results_found");

  /**
   * @param {string} value param required for getFilterVal function
   * @function getFilterVal function fetches the filterValues for the search filter
   */
  const getFilterVal = (value) => {
    getFilter(value);
  };

  const paginationLimitValue = rowsPerPageOptions.length > 0 ? rowsPerPageOptions : defaultRowPerPageOption;
  const perpageDefault = rowsPerPageOptions.length > 0 ? rowsPerPageOptions[0] : defaultRowPerPageOption[1];

  return (
    <>
      <Grid item className={classes.gridStyle}>
        <Typography variant="h5" color="inherit" className={classes.titleLineHeight}>
          {gridTitle}
        </Typography>
      </Grid>
      {gridTitle && <Divider variant="fullWidth" />}
      <ResourceContextProvider resource={resource}>
        <List
          {...props}
          resource={resource}
          basePath={basePath}
          sort={sortField}
          bulkActionButtons={bulkActionButtons}
          pagination={
            <CustomPagination rowsPerPageOptions={paginationLimitValue} limit={limit || NO_RESULTS_FOUND_MESSAGE} />
          }
          filters={
            filters || (
              <GridFilters
                isSearchEnabled={isSearchEnabled}
                clearSearchFilter={clearSearchFilter}
                resetClearSearchFilter={resetClearSearchFilter}
                getFilterVal={getFilterVal}
                searchLabel={searchLabel}
                {...props}
              />
            )
          }
          actions={<GridActions actionButtonsForGrid={actionButtonsForGrid} />}
          component="div"
          empty={<EmptyPage actionButtonsForEmptyGrid={actionButtonsForEmptyGrid} additionalLink={additionalLink} />}
          perPage={perpageDefault}
        >
          <CustomizableDatagrid
            {...props}
            className={classes.grid}
            filters={showAddFilterButton ? filters : null}
            additionalLink={additionalLink}
            rowStyleFunc={rowStyleFunc}
          >
            {configurationForGrid.map((field) => {
              const componentType = field.type;
              const Component = componentsMap[componentType];
              return <Component key={field} {...field} />;
            })}
          </CustomizableDatagrid>
        </List>
      </ResourceContextProvider>
    </>
  );
};

SimpleGrid.propTypes = {
  configurationForGrid: PropTypes.arrayOf(PropTypes.object).isRequired,
  actionButtonsForGrid: PropTypes.arrayOf(PropTypes.object).isRequired,
  actionButtonsForEmptyGrid: PropTypes.arrayOf(PropTypes.object),
  gridTitle: PropTypes.string.isRequired,
  searchLabel: PropTypes.string,
  resource: PropTypes.string.isRequired,
  basePath: PropTypes.string,
  bulkActionButtons: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  sortField: PropTypes.objectOf(PropTypes.string),
  filters: PropTypes.objectOf(PropTypes.any),
  getFilter: PropTypes.func,
  showAddFilterButton: PropTypes.bool,
  isSearchEnabled: PropTypes.bool,
  clearSearchFilter: PropTypes.bool,
  resetClearSearchFilter: PropTypes.func,
  rowStyleFunc: PropTypes.func,
  additionalLink: PropTypes.element,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  limit: PropTypes.string,
};
SimpleGrid.defaultProps = {
  bulkActionButtons: false,
  searchLabel: "",
  showAddFilterButton: false,
  sortField: { field: "id", order: "DESC" },
  filters: null,
  basePath: "",
  actionButtonsForEmptyGrid: null,
  getFilter: () => {},
  isSearchEnabled: true,
  clearSearchFilter: false,
  resetClearSearchFilter: () => {},
  rowStyleFunc: () => {},
  additionalLink: <></>,
  rowsPerPageOptions: [],
  limit: "",
};

export default SimpleGrid;
