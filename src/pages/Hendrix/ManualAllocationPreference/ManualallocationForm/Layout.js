/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import { useTranslate, useDataProvider, useNotify } from "react-admin";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { stubTrue } from "lodash";
import TableGrid from "../../../../components/TableGrid";
import TextEditor from "../../../../components/DataGridtable/TextEditor";
import FormatterView from "../../../../components/DataGridtable/FormatterView";
import PopupView from "../../../../components/DataGridtable/PopupView";
import Modal from "../../../../components/CreateModal";
import { menuOptions, menuRuleOptions, getNewRows } from "../../common";
import { TIMEOUT } from "../../../../config/GlobalConfig";

const resource = `${window.REACT_APP_HENDRIX_SERVICE}/manual-allocation-preferences`;
/**
 * Component for Manual Allocation Carrier
 *
 * @param {*} props all the props needed for Manual Allocation Carrier
 * @returns {React.ReactElement} returns Manual Allocation Carrier component with datagrid
 */
const CategoryList = ({ apiData, selectedInput, searchInput, fetchData, pageData, pgGroup, onUpdateCall }) => {
  const history = useHistory();
  const translate = useTranslate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [importPopupFlag, toggleFlag] = useState(false);
  const [dialogObject, setConfirmDialog] = useState("");
  const [rows, setRows] = useState([]);
  const [deleteId, setDeleteId] = useState();
  const [columns, setColumns] = React.useState([]);
  const [vendorColumn, setVendorColumn] = useState([]);

  /**
   * @function onPopupClick To perform Menu Operations based on the selected value from grid row popup
   * @param {object} rowList current row
   * @param {string} type key value edit or delete
   */
  const onPopupClick = (rowList, type) => {
    const stateObj = {
      editData: rowList,
      apiVal: apiData,
      inputs: selectedInput,
      pgArray: pgGroup,
      rowList,
    };
    const encodedObj = btoa(JSON.stringify(stateObj));
    switch (type) {
      case "Edit":
        history.push({
          pathname: "/hendrix/v1/manualallocation/rule",
          search: `?add=${encodedObj}&edit=${true}`,
        });
        break;
      case "Delete":
        {
          setDeleteId(rowList.id);
          const dialogObj = {
            dialogContent: translate(`mapCarrier_deleteDialog`),
            showButtons: true,
            closeText: translate(`mapCarrier_deny`),
            actionText: translate(`mapCarrier_confirm`),
          };
          setConfirmDialog(dialogObj);
          toggleFlag(true);
        }
        break;
      case "Duplicate Rule":
        history.push({
          pathname: "/hendrix/v1/manualallocation/duplicate",
          search: `?duplicate=${encodedObj}`,
        });
        break;
      default:
        history.push({
          pathname: "/hendrix/v1/manualallocation/rule",
          search: `?add=${encodedObj}`,
        });
        break;
    }
  };

  /**
   * To construct array of objects using response for datagrid rows
   *
   * @param {Array} rowData consists the row data
   * @returns {Array} rows
   */
  const createRows = (rowData) => {
    if (!rowData) return [];
    return rowData?.map((r) => {
      const { quota, ...res } = r;
      const obj = quota.reduce((a, c) => {
        return { ...a, ...{ [c.vendorName]: c.value } };
      }, {});
      return { ...obj, ...res, quota };
    });
  };

  useEffect(() => {
    const vendorHeader = [];
    apiData.forEach((li) => {
      li.quota.forEach((data) => {
        if (!vendorHeader.includes(data.vendorName)) {
          vendorHeader.push(data.vendorName);
        }
      });
    });
    /**
     * @function to sort the vendorNames in ascending order
     * @param {string} a header
     * @param {string} b header
     * @returns {string} Sorted Value
     */
    const customSort = (a, b) => {
      return Number(a && a.match(/(\d+)/g)[0]) - Number(b && b.match(/(\d+)/g)[0]);
    };
    const header = vendorHeader.sort(customSort);
    setVendorColumn(header);
    setRows(createRows(apiData));
  }, [apiData]);

  useEffect(() => {
    const header = [
      {
        key: "Menu",
        name: "",
        width: 80,
        resizable: true,
        frozen: true,
        formatter: (p) => PopupView(p, menuOptions, onPopupClick, menuRuleOptions),
      },
      {
        key: "baseGeoId",
        name: translate("pincode"),
        width: 140,
        frozen: true,
        formatter: (p) => FormatterView(p),
      },
      {
        key: "configName",
        name: translate(`mapCarrier_configName`),
        width: 140,
        formatter: (p) => FormatterView(p),
        frozen: true,
      },
      {
        key: "fromDate",
        name: translate(`mapCarrier_fromDate`),
        width: 140,
        resizable: true,
        formatter: (p) => FormatterView(p),
        frozen: true,
      },
      {
        key: "thruDate",
        name: translate(`mapCarrier_toDate`),
        width: 140,
        resizable: true,
        formatter: (p) => FormatterView(p),
        frozen: true,
      },
    ];
    vendorColumn.forEach((data) => {
      header.push({
        key: data,
        name: data,
        width: 200,
        resizable: true,
        editor: (e) => TextEditor(e, onUpdateCall, stubTrue),
        formatter: (p) => FormatterView(p, "", stubTrue),
        editable: true,
      });
    });
    setColumns(header);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorColumn]);

  /**
   * @function to fetch new rows on scrolling down the grid
   * @returns {null} null/Error
   */
  const loadMoreRows = async () => {
    await getNewRows(pageData, searchInput, selectedInput, fetchData, createRows, setRows, "loadMore");
  };

  /**
   *Function to handle toggle flag to close dialog
   *
   */
  const onDeleteCall = async () => {
    if (deleteId === null) {
      toggleFlag(false);
      return;
    }
    const res = await dataProvider.delete(`${resource}/id/${deleteId}`, "");
    if (res.status === "success") {
      toggleFlag(false);
      const RowList = rows.slice();
      const rowsFull = RowList.filter((row) => row.id !== deleteId);
      setRows(rowsFull);
      notify(translate(`mapCarrier_toast_delete`), "info", TIMEOUT);
    } else if (res.message) {
      toggleFlag(false);
      notify(translate(res.message), "error", TIMEOUT);
    }
  };

  return (
    <>
      <TableGrid columns={columns} rowValues={rows} updatedRowDetails={() => ""} loadMoreRows={loadMoreRows} />
      <Modal
        {...dialogObject}
        openModal={importPopupFlag}
        handleClose={() => toggleFlag(false)}
        handleAction={onDeleteCall}
      />
    </>
  );
};
CategoryList.propTypes = {
  apiData: PropTypes.objectOf(PropTypes.any).isRequired,
  selectedInput: PropTypes.objectOf(PropTypes.any).isRequired,
  fetchData: PropTypes.func.isRequired,
  pageData: PropTypes.objectOf(PropTypes.any).isRequired,
  pgGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  onUpdateCall: PropTypes.func.isRequired,
  searchInput: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default CategoryList;
