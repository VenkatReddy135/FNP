/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteProduct from "./DeleteProduct";

/**
 * CustomBulkActionButtons component to display action buttons on grid
 *
 * @param {object} props props of the action buttons
 * @returns {React.ReactElement} update and delete button on the grid
 */
const CustomBulkActionButtons = (props) => {
  const translate = useTranslate();
  const { match, selectedIds, id, checkboxToggleFunc } = props;
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (selectedIds?.length > 0) {
      checkboxToggleFunc(true);
    } else {
      checkboxToggleFunc(false);
    }
  }, [selectedIds]);

  /**
   * @function updateHandler to update the checked records
   */
  const updateHandler = () => {
    history.push({
      pathname: `/${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/${selectedIds}/categoryId=${match.params.id}`,
    });
  };
  /**
   * @function deleteHandler to delete the checked records
   */
  const deleteHandler = () => {
    setOpenModal(true);
  };

  /**
   * @function setOpenModalClose to close delete modal
   */
  const setOpenModalClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <DeleteProduct id={id} openModal={openModal} productId={selectedIds} setOpenModalClose={setOpenModalClose} />
      <Grid container>
        <Grid item>
          <Button
            variant="outlined"
            label={translate("edit")}
            onClick={updateHandler}
            startIcon={<EditOutlinedIcon />}
          />
          <Button
            variant="outlined"
            label={translate("delete")}
            onClick={deleteHandler}
            startIcon={<DeleteOutlineOutlinedIcon />}
          />
        </Grid>
      </Grid>
    </>
  );
};
CustomBulkActionButtons.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  id: PropTypes.string.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  checkboxToggleFunc: PropTypes.func.isRequired,
};
CustomBulkActionButtons.defaultProps = {
  selectedIds: [""],
};

export default CustomBulkActionButtons;
