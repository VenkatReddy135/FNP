/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslate, useMutation, useNotify, useRefresh } from "react-admin";
import { Link, Tooltip } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SimpleGrid from "../../../components/SimpleGrid";
import LoaderComponent from "../../../components/LoaderComponent";
import ProductFilter from "./ProductFilter";
import CustomBulkActionButtons from "./CustomBulkActionButtons";
import DeleteProduct from "./DeleteProduct";
import { onSuccess, onFailure } from "../../../utils/CustomHooks";
import pollingService from "../../../utils/pollingService";
import { TIMEOUT, rowsPerPageOptions, color, IN_PROGRESS } from "../../../config/GlobalConfig";
import useStyles from "../../../assets/theme/common";
/**
 * ProductList component to display products for category
 *
 * @param {object} props props of category
 * @returns {React.ReactElement}  Listing page.
 */
const ProductList = (props) => {
  const { id } = props;
  const [mutate] = useMutation();
  const notify = useNotify();
  const refresh = useRefresh();
  const translate = useTranslate();
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [interimAction, setInterimAction] = useState("");
  const [loader, setLoader] = useState(false);
  const [productId, setProductId] = useState([]);
  const [sequenceData, setSequenceData] = useState([]);
  const actionButtonsForCategoryProductsGrid = [];
  const [hideSuppressdProducts, sethideSuppressdProducts] = useState(false);
  const [isProductSelected, setIsProductSelected] = useState(false);
  const { red } = color;
  const interimMessage = `${
    interimAction === "populateproduct" ? translate("product_list.population") : translate("product_list.auto_sequence")
  } ${translate("product_list.under_process")}`;

  /**
   * handle on polling success
   *
   * @function onPollingSuccess to handle polling success
   */
  const onPollingSuccess = () => {
    refresh();
  };

  const { handlePollingSuccess } = pollingService({
    notify,
    mutate,
    translate,
    setLoader,
    url: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/request-status`,
    successMessage: translate("product_list.product_successfully_added"),
    onPollingSuccess,
    pollingTimeout: 960000,
    intervalDelay: 30000,
  });
  /**
   * @function handleProductListSuccess to handle success of the API
   * @param {object} res to set res
   */
  const handleProductListSuccess = (res) => {
    if (res.data?.status === IN_PROGRESS) {
      handlePollingSuccess(id);
      setInterimAction(res.data?.actions);
    } else {
      setLoader(false);
    }
  };

  /**
   * API To get call list of products
   *
   * @name productPollingService
   */
  const productPollingService = () => {
    mutate(
      {
        type: "getData",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/request-status/${id}`,
        payload: {},
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleProductListSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  useEffect(() => {
    productPollingService();
  }, []);
  /**
   *@function checkboxToggleFunc function to toggle checkbox
   *@param {boolean} isChecked boolean value to toggle
   */
  const checkboxToggleFunc = (isChecked) => {
    setIsProductSelected(isChecked);
  };
  /**
   * @function deleteProductHandler function to delete selected single item
   *
   * @param {string} pId selected campaign id to delete
   */
  const deleteProductHandler = (pId) => {
    setProductId([pId]);
    setOpenModal(true);
  };

  const configurationForKebabMenu = [
    {
      id: "1",
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      routeType: `/categoryId=${id}`,
      isEditable: true,
    },
    {
      id: "2",
      type: "Delete",
      leftIcon: <DeleteOutlineOutlinedIcon />,
      path: "",
      routeType: "",
      onClick: deleteProductHandler,
    },
  ];
  /**
   * @function setOpenModalClose to close delete modal
   */
  const setOpenModalClose = () => {
    setOpenModal(false);
  };
  /**
   * updatedRowVal component to display the field as an external link
   *
   * @function updatedInputCallback function which called for storing the updated sequence fields
   * @param {object} data object containing name and value
   */
  const updatedInputCallback = (data) => {
    const { name, value } = data;
    const elementIndex = sequenceData.findIndex((el) => el.productId === name);
    if (elementIndex >= 0) {
      const updatedSequence = [...sequenceData];
      updatedSequence[elementIndex].sequence = value * 1;
      setSequenceData([...updatedSequence]);
    } else {
      setSequenceData([...sequenceData, { productId: name, sequence: value * 1 }]);
    }
  };

  /** updatedRowVal component to display the field as an external link
   *
   * @param {object} record record value
   * @returns {React.ReactElement} external link component
   */
  const updatedRowVal = (record) => {
    const { productUrl, productName, productId: ProductIdRow } = record;
    return (
      <Tooltip
        PopperProps={{
          disablePortal: true,
        }}
        arrow
        interactive
        title={`${productName} [${ProductIdRow}]`}
      >
        <Link target="_blank" href={productUrl}>
          {`${productName} [${ProductIdRow}]`}
        </Link>
      </Tooltip>
    );
  };

  /** checkThroughDate function to display date in red color if through date is passed
   *
   * @param {object} record record value of row
   * @returns {object} style object
   */
  const checkThroughDate = (record) => {
    const { thruDate } = record;
    let style = null;
    if (new Date(thruDate) < new Date()) {
      style = { color: red };
    }
    return style;
  };

  const configurationForCategoryRelationsGrid = [
    {
      source: "productId",
      isLink: false,
      externalComponent: updatedRowVal,
      configurationForKebabMenu,
      tabPath: "",
      type: "KebabMenuWithLink",
      label: translate("product_list.product_url"),
    },
    {
      source: "sequence",
      type: "CustomGridInputField",
      label: translate("sequence"),
      updatedInputCallback,
      column: "sequence",
      inputType: "number",
      inputClass: classes.smallInputNumber,
      uniqueValue: "productId",
    },
    { source: "fromDate", type: "CustomDateField", label: translate("from_date") },
    {
      source: "thruDate",
      type: "CustomDateField",
      label: translate("through_date"),
      externalStyle: checkThroughDate,
    },
    { source: "updatedAt", type: "CustomDateField", label: translate("product_updated_at") },
    { source: "createdBy", type: "TextField", label: translate("created_by") },
    { source: "updatedBy", type: "TextField", label: translate("last_updated_by") },
  ];
  /**
   * @function rowStyleHandler to apply row style in the grid
   * @param {object} record each record in the list
   * @returns {object} style object
   */
  const rowStyleHandler = (record) => ({
    backgroundColor: record.suppressed ? "rgba(196,196,196,0.3)" : null,
  });
  /**
   * @function handleSuccess to handle success of the API
   * @param {object} response API response object
   */
  const handleSuccess = (response) => {
    notify(response.data?.message, "info", TIMEOUT);
    setSequenceData([]);
    refresh();
  };

  /**
   * @function clearSequenceData to clear Sequence Data in the list
   */
  const clearSequenceData = () => {
    setSequenceData([]);
  };

  /**
   * @function sequenceUpdateHandler
   */
  const sequenceUpdateHandler = () => {
    const invalidSequence = sequenceData.find(({ sequence }) => sequence < 1);
    if (invalidSequence) {
      notify(translate("add_category.error_sequence"), "error", TIMEOUT);
    } else {
      mutate(
        {
          type: "put",
          resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/list/sequence/${id}`,
          payload: {
            data: sequenceData,
            id: { extraHeaders: { "Accept-Language": "en" } },
          },
        },
        {
          onSuccess: (response) => {
            onSuccess({ response, notify, translate, handleSuccess });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate });
          },
        },
      );
    }
  };

  /**
   * @name handleSuppressedproduct function to handle the Suppressed product
   *
   */
  const handleSuppressedproduct = () => {
    sethideSuppressdProducts(!hideSuppressdProducts);
  };
  const productFilter = useMemo(() => {
    return (
      <ProductFilter
        id={id}
        sequenceUpdateHandler={sequenceUpdateHandler}
        sequenceData={sequenceData}
        hideSuppressdProducts={hideSuppressdProducts}
        handleSuppressedproduct={handleSuppressedproduct}
        clearSequenceData={clearSequenceData}
        isProductSelected={isProductSelected}
      />
    );
  }, [sequenceData, hideSuppressdProducts, id, isProductSelected]);
  return (
    <>
      {productFilter}
      <DeleteProduct id={id} openModal={openModal} productId={productId} setOpenModalClose={setOpenModalClose} />
      {loader ? (
        <LoaderComponent message={interimMessage} />
      ) : (
        <SimpleGrid
          {...props}
          bulkActionButtons={<CustomBulkActionButtons {...props} checkboxToggleFunc={checkboxToggleFunc} />}
          configurationForGrid={configurationForCategoryRelationsGrid}
          actionButtonsForGrid={actionButtonsForCategoryProductsGrid}
          actionButtonsForEmptyGrid={actionButtonsForCategoryProductsGrid}
          gridTitle=""
          isSearchEnabled={false}
          resource={`${window.REACT_APP_COLUMBUS_SERVICE}/categories/products`}
          filter={{ categoryId: id, hideSuppressdProducts, extraHeaders: { "Accept-Language": "en" } }}
          sortField={{ field: "sequence", order: "ASC" }}
          rowStyleFunc={rowStyleHandler}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </>
  );
};

ProductList.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ProductList;
