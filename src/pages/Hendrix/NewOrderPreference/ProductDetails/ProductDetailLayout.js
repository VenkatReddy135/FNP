/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Typography, Divider, Grid, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslate, ResourceContextProvider, DateInput, required, SimpleForm, SaveButton } from "react-admin";
import useStyles from "../../styles";
import TableGrid from "../../../../components/TableGrid";
import DropdownButton from "./DropdownButton";
import PageHeader from "../../../../components/PageHeader";
import SearchComponent from "../../../../components/SearchComponent";
import { fcFieldNameArray, formatDateConvert } from "../../common";

/**
 * Component for rendering all FCs for selected FC id & Product-group
 *
 * @param {*} props all the props needed
 * @returns {React.ReactElement} returns a component
 */
const ProductDetailLayout = ({
  ColumnResult,
  RowResult,
  actionViewButton,
  gridTitle,
  showTable,
  setShowTable,
  setVendorData,
  setCalendarData,
  setCompactView,
  searchInput,
  setSearchInput,
  searchCall,
  fetchCalendarData,
  setDateRanges,
  ...props
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const classes = useStyles();
  const translate = useTranslate();

  /**
   * @function to switch between compact & calendar view
   * @param {object} event event
   * @param {number} index key
   */
  const handleMenuItemClick = async (event, index) => {
    setSelectedIndex(index);
    if (index) {
      setShowTable(false);
      setVendorData([]);
    } else if (index === 0) {
      setCalendarData([]);
      setCompactView((prev) => !prev);
      setShowTable(true);
    }
  };
  return (
    <>
      <PageHeader
        header={{
          ruleName: gridTitle,
        }}
      />
      <Box className={classes.headerActionButton}>
        <DropdownButton handleMenuItemClick={handleMenuItemClick} selectedIndex={selectedIndex} />
      </Box>
      <SimpleForm
        className={classes.pageSimpleForm}
        save={selectedIndex ? fetchCalendarData : null}
        submitOnEnter={false}
        toolbar={
          selectedIndex ? <SaveButton className={classes.saveBtn} variant="outlined" icon={<></>} label="VIEW" /> : null
        }
      >
        {selectedIndex ? (
          <Grid container className={classes.calendarView}>
            <Typography variant="subtitle2">Select your date range</Typography>
            <DateInput
              source="fromDate"
              label={translate(`mapCarrier_fromDate`)}
              className={classes.dateField}
              onChange={(event) => {
                setDateRanges((prev) => {
                  return { ...prev, fromDate: formatDateConvert(event.target.value) };
                });
              }}
              validate={required()}
            />
            <DateInput
              source="thruDate"
              label={translate("mapCarrier_toDate")}
              className={classes.dateField}
              onChange={(event) => {
                setDateRanges((prev) => {
                  return { ...prev, thruDate: formatDateConvert(event.target.value) };
                });
              }}
              validate={required()}
            />
          </Grid>
        ) : null}
      </SimpleForm>
      {showTable &&
        (RowResult.length > 0 ||
          (searchInput.fieldValues && searchInput.fieldName && searchInput.operator) ||
          (searchInput.fieldName && searchInput.operator)) && (
          <>
            <Grid item>
              <SearchComponent
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                searchCall={searchCall}
                menuItem={fcFieldNameArray}
              />
            </Grid>
            <Divider variant="fullWidth" />
            {RowResult.length > 0 ? (
              <ResourceContextProvider>
                <Grid container className={classes.TableStyle}>
                  <TableGrid {...props} columns={ColumnResult} rowValues={RowResult} />
                </Grid>
              </ResourceContextProvider>
            ) : (
              <div>
                <h4>No records found</h4>
              </div>
            )}
          </>
        )}
    </>
  );
};

ProductDetailLayout.propTypes = {
  actionViewButton: PropTypes.arrayOf(PropTypes.object).isRequired,
  ColumnResult: PropTypes.string.isRequired,
  gridTitle: PropTypes.string.isRequired,
  RowResult: PropTypes.string.isRequired,
  props: PropTypes.string.isRequired,
  setShowTable: PropTypes.func.isRequired,
  showTable: PropTypes.bool.isRequired,
  setVendorData: PropTypes.func.isRequired,
  setCalendarData: PropTypes.func.isRequired,
  setCompactView: PropTypes.func.isRequired,
  searchInput: PropTypes.objectOf(PropTypes.any).isRequired,
  setSearchInput: PropTypes.func.isRequired,
  searchCall: PropTypes.func.isRequired,
  setDateRanges: PropTypes.func.isRequired,
  fetchCalendarData: PropTypes.func.isRequired,
};

export default ProductDetailLayout;
