/* eslint-disable react/destructuring-assignment */
import React, { useState, useCallback } from "react";
import { useTranslate, SimpleForm } from "react-admin";
import PropTypes from "prop-types";
import { Checkbox, FormControlLabel } from "@material-ui/core";

/**
 * Component for product Association.
 *
 * @param {*}  props for category create Product association
 * @returns {React.ReactElement} returns a product Association component
 */
const CategoryProduct = (props) => {
  const translate = useTranslate();
  const { inheritVal } = props;
  const [associationProduct, setAssociationProduct] = useState({ isAssociation: inheritVal });

  /**
   * handle change event for checkboxes group
   *
   * @param {*} e for event
   */
  const handleCheckboxUpdate = useCallback((e) => {
    setAssociationProduct({
      [e.target.name]: e.target.checked,
    });
  }, []);
  props.inheritChangedVal(associationProduct.isAssociation);
  return (
    <div>
      <SimpleForm initialValues={null} toolbar={<></>}>
        <FormControlLabel
          control={
            <Checkbox checked={associationProduct.isAssociation} onChange={handleCheckboxUpdate} name="isAssociation" />
          }
          label={translate("category_product_asso")}
        />
      </SimpleForm>
    </div>
  );
};
CategoryProduct.propTypes = {
  inheritVal: PropTypes.bool,
  inheritChangedVal: PropTypes.func,
};
CategoryProduct.defaultProps = {
  inheritVal: false,
  inheritChangedVal: () => {},
};

export default React.memo(CategoryProduct);
