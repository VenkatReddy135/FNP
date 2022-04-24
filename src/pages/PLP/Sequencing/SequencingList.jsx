import React, { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslate, useNotify, useMutation, useRefresh } from "react-admin";
import { FixedSizeGrid as ReactWindowGrid } from "react-window";
import { WindowScroller } from "react-virtualized";
import { Box, DialogContent, DialogContentText } from "@material-ui/core";
import { chunk, flatten } from "lodash";
import ProductItem from "./ProductItem";
import SimpleModel from "../../../components/CreateModal";
import LoaderComponent from "../../../components/LoaderComponent";
import useStyles from "./sequencingStyles";
import { useCustomQueryWithStore, onSuccess, onFailure } from "../../../utils/CustomHooks";
import { TIMEOUT } from "../../../config/GlobalConfig";
import ActionButtons from "./ActionButtons";
/**
 * This component will display list of the products for sequencing
 *
 * @param {object} props resource configuration
 * @returns {React.ReactElement} SequencingList Component.
 */
const SequencingList = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const [sequenceData, setSequenceData] = useState({
    showSuppressed: true,
    openModel: false,
    loading: false,
    content: "",
    type: "",
  });
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [changedSequence, setChangedSequence] = useState([]);
  const { showSuppressed, openModel, content, type } = sequenceData;
  const notify = useNotify();
  const { id } = props;
  const [mutate] = useMutation();
  const refresh = useRefresh();
  const grid = useRef(null);

  /**
   * @function handleScroll This function will check the scrollTop value
   */
  const handleScroll = useCallback(({ scrollTop }) => {
    grid.current?.scrollTo({ scrollTop });
  }, []);

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    const productsData = chunk(res.data, 4);
    setProducts(productsData);
    setAllProducts(res.data);
  };

  const { loading } = useCustomQueryWithStore(
    "getData",
    `${window.REACT_APP_COLUMBUS_SERVICE}/categories/productinsequences?categoryId=${id}&currency=INR`,
    handleSetDataSuccess,
    {
      payload: {
        extraHeaders: { "Accept-Language": "en" },
      },
    },
  );

  /**
   * @function dialogContent
   * @returns {React.createElement} returning ui for hide and show suppressed product page
   * @param {string } message name of the action
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   * @function handleSuppressedProduct To hide the suppressed product
   */
  const handleSuppressedProduct = () => {
    let productsData = chunk(allProducts, 4);
    if (showSuppressed) {
      const filteredProducts = allProducts.filter(({ suppressed }) => !suppressed);
      productsData = chunk(filteredProducts, 4);
    }
    setProducts(productsData);
    setSequenceData((prevState) => ({ ...prevState, openModel: false, showSuppressed: !showSuppressed }));
  };

  /**
   * @function handleSuccess to handle success of the API
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    notify(translate(res.data?.message), "info", TIMEOUT);
    setChangedSequence([]);
    refresh();
  };

  /**
   * @function handleUpdateProduct To update the suppressed product
   */
  const handleUpdateProduct = () => {
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/list/sequence/${id}`,
        payload: {
          data: changedSequence,
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
      setSequenceData({ ...sequenceData, openModel: false }),
    );
  };

  /**
   * Function To confirm the yes action button
   *
   * @name handleConfirmationYes
   */
  const handleConfirmationYes = () => {
    if (type === "update") {
      handleUpdateProduct();
    } else {
      handleSuppressedProduct();
    }
  };

  /**
   * @function showPopup To show pop up of suppressed product
   * @param {string } message name of the action
   * @param {string } actionType name of the action
   */
  const showPopup = (message, actionType) => {
    setSequenceData((prevState) => ({ ...prevState, openModel: true, content: message, type: actionType }));
  };

  /**
   * @function closePopup To close pop up of suppressed product
   */
  const closePopup = () => {
    setSequenceData((prevState) => ({ ...prevState, openModel: false }));
  };

  /**
   * @function setScroll To manage the scroll to particular position
   * @param {number} item selected items position
   */
  const setScroll = (item) => {
    // 600 card and space width and 272 above heading space
    window.scrollTo(0, parseInt((item / 4) * 600 + 270, 10));
  };

  /**
   * @function moveToPosition To update changed sequence
   * @param {object} productItem selected items value
   */
  const moveToPosition = (productItem) => {
    const { name, value } = productItem;
    const elementIndex = changedSequence.findIndex((el) => el.productId === name);
    if (elementIndex >= 0) {
      const updatedSequence = [...changedSequence];
      updatedSequence[elementIndex].sequence = value * 1;
      setChangedSequence([...updatedSequence]);
    } else {
      setChangedSequence((prevState) => [...prevState, { productId: name, sequence: value * 1 }]);
    }
  };

  /**
   * @function handleManageSequence To manage the sequence on enter click
   * @param {object} event info of the current product
   */
  const handleManageSequence = (event) => {
    if (event.key === "Enter") {
      const { name, value } = event.target;
      const flattenProducts = flatten(products);
      const elementsIndex = flattenProducts.findIndex((element) => element.productId === name);
      const updatedProducts = [...flattenProducts];
      updatedProducts[elementsIndex] = { ...updatedProducts[elementsIndex], sequence: value * 1 };
      const sortedProducts = updatedProducts.sort((a, b) => a.sequence - b.sequence);
      setScroll(value);
      setProducts(chunk(sortedProducts, 4));
      moveToPosition(event.target);
    }
  };

  /**
   * @function Cell To handle cell function
   * @param {number} columnIndex columnIndex of particular row item
   * @returns {object} product items
   */
  const Cell = ({ columnIndex, rowIndex, style }) => {
    let cellData = null;
    const count = products[rowIndex].length;
    if (columnIndex < count) {
      cellData = (
        <div style={style}>
          <div className={classes.itemSequence} role="button" tabIndex="0" onKeyDown={handleManageSequence}>
            <ProductItem product={products[rowIndex][columnIndex]} />
          </div>
        </div>
      );
    }
    return cellData;
  };

  if (loading) {
    return <LoaderComponent />;
  }

  const screenSize = window.matchMedia("(max-width: 1280px)");
  const columnWidth = screenSize.matches ? 275 : 300;
  const width = screenSize.matches ? 1100 : 1200;

  return (
    <>
      <WindowScroller onScroll={handleScroll}>{() => <div />}</WindowScroller>
      <ActionButtons changedSequence={changedSequence} showSuppressed={showSuppressed} id={id} showPopup={showPopup} />
      <Box className={classes.sequenceBox} mx="auto" mt={3}>
        {products.length ? (
          <ReactWindowGrid
            columnCount={4}
            columnWidth={columnWidth}
            height={600}
            ref={grid}
            rowCount={products.length}
            rowHeight={600}
            width={width}
            style={{ height: "100% !important" }}
          >
            {Cell}
          </ReactWindowGrid>
        ) : null}
      </Box>
      <SimpleModel
        dialogContent={dialogContent(content)}
        showButtons
        closeText={translate("no_button_label")}
        actionText={translate("yes_button_label")}
        openModal={openModel}
        handleClose={closePopup}
        handleAction={handleConfirmationYes}
      />
    </>
  );
};

SequencingList.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SequencingList;
