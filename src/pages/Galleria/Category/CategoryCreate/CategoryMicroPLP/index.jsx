/* eslint-disable react/destructuring-assignment */
import React, { useState, useCallback } from "react";
import { SimpleForm, useTranslate, Button } from "react-admin";
import PropTypes from "prop-types";
import { Typography, makeStyles } from "@material-ui/core";
import GenericRadioGroup from "../../../../../components/RadioGroup";
import { manageContentLink } from "../../../../../config/GlobalConfig";

const useStyles = makeStyles(() => ({
  manageBtn: {
    color: "#FF9212",
  },
}));
const optionsMicrosite = [
  { id: "MICROSITE", name: "Microsite" },
  { id: "PLP", name: "Standard PLP" },
];
/**
 * Component for microsite/PLP radio button.
 *
 * @param {*} props for category Micro/PLP
 * @returns {React.ReactElement} returns a microsite/PLP component
 */
const CategoryMicroPLP = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const { templateType } = props;
  const [isMicroPLP, setIsMicroPLP] = useState(optionsMicrosite[0].id);
  const [selectedMicroPlp, updateSelectedMicroPlp] = useState({
    val: templateType,
  });
  /**
   *@function getDisplayText
   *@param {Array } optionsArr array of objects to filter
   *@param {string } propertyToMatch property of object to match
   *@param {string } propertyToReturn property of object expected to return
   *@returns {string} text to display is returned
   */
  const getDisplayText = useCallback((optionsArr, propertyToMatch, propertyToReturn) => {
    let result = optionsArr.filter((obj) => obj.id === propertyToMatch)[0];
    if (result) {
      result = propertyToReturn ? result[propertyToReturn] : result.name;
    }
    return result;
  }, []);
  /**
   * handle change event for radio group values
   *
   * @param {string} value value of selected radio group option
   * @param {string} name of radio group
   */
  const handleChange = useCallback(
    (value, name) => {
      setIsMicroPLP({ [name]: value });
      updateSelectedMicroPlp({ ...selectedMicroPlp, val: value });
    },
    [selectedMicroPlp],
  );
  props.micro_plpChangedVal(selectedMicroPlp);

  /**
   * Function to open new tab with fnp.com
   *
   * @function redirect
   */
  const redirect = () => {
    window.open(manageContentLink, "_blank");
  };
  return (
    <div>
      <SimpleForm initialValues={isMicroPLP} toolbar={<></>}>
        <GenericRadioGroup
          label={translate("is_micro_plp")}
          source="is-microsite-plp"
          choices={optionsMicrosite}
          editable
          disabled={false}
          displayText={getDisplayText(optionsMicrosite, isMicroPLP)}
          defaultValue={templateType}
          onChange={(e) => handleChange(e, "is-microsite-plp")}
        />
        <Typography>{translate("category_micro_plp")}</Typography>
        <Button variant="outlined" label={translate("manage_cont")} className={classes.manageBtn} onClick={redirect} />
      </SimpleForm>
    </div>
  );
};
CategoryMicroPLP.propTypes = {
  templateType: PropTypes.string,
  micro_plpChangedVal: PropTypes.func,
};
CategoryMicroPLP.defaultProps = {
  templateType: "",
  micro_plpChangedVal: () => {},
};

export default React.memo(CategoryMicroPLP);
