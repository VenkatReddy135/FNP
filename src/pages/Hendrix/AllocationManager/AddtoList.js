import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useTranslate, SimpleForm, TextInput, SaveButton, required, useNotify } from "react-admin";
import PropTypes from "prop-types";
import Dropdown from "../../../components/Dropdown";
import useStyles from "../styles";
import { TIMEOUT } from "../../../config/GlobalConfig";
/**
 * Component for rendering the Input field
 *
 * @param {object} props  for add new list
 * @param {Array} props.rows  table rows
 * @param {Function} props.setRows  function to update rows state value
 * @param {Function} props.setFcType function to set the fc name/fc id
 * @param {Function} props.onAddToList function to handle the inputs
 * @returns {React.ReactElement} returns Input field with button
 */
const AddToList = ({ setRows, rows, setFcType, onAddToList }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const [selectedVendors, setSelectedVendors] = useState("");
  const [fcTypeForList, setFcTypeForList] = useState("");

  const FcNames = [
    { id: "VENDOR_ID", name: "FC ID" },
    { id: "VENDOR_NAME", name: "FC Name" },
  ];

  /**
   * @function onSaveList function to validate for duplicate entry and add the fcs to state
   */
  const onSaveList = () => {
    const list = selectedVendors.split(",").map((value) => value.trim());
    if (list && list.length > 0 && fcTypeForList) {
      const newFcs = list.filter((fc) =>
        rows.every((row) => !Object.values(row).join("").toLowerCase().includes(fc.toLowerCase())),
      );
      let newList = [];
      if (newFcs.length > 0) {
        newList = newFcs.map((fcs) => {
          if (fcTypeForList === "VENDOR_ID") return { id: fcs, "FC ID": fcs, fcTypeForList };
          return { id: fcs, "FC Name": fcs, fcTypeForList };
        });
        setRows((prev) => [...prev, ...newList]);
        setFcType(fcTypeForList);
        onAddToList();
      } else notify(translate("FC Already exists"), "info", TIMEOUT);
    }
  };
  return (
    <SimpleForm
      className={classes.container}
      submitOnEnter={false}
      save={onSaveList}
      toolbar={
        selectedVendors && fcTypeForList ? (
          <SaveButton
            variant="outlined"
            className={classes.listBtn}
            icon={<></>}
            label={translate(`add_toListButton`)}
          />
        ) : null
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h6">{translate(`am_search_label`)}</Typography>
        </Grid>
        <Grid item>
          <TextInput
            className={classes.textField}
            label={translate(`am_search_text`)}
            source="searchText"
            onChange={(e) => setSelectedVendors(e.target.value)}
            validate={[required()]}
            autoComplete="off"
            helperText={translate(`helper_text`)}
          />
        </Grid>
        <Grid item xs={2}>
          <Dropdown
            label={translate(`am_id_name`)}
            data={FcNames}
            onSelect={({ target }) => setFcTypeForList(target.value)}
            edit
            validate={[required()]}
          />
        </Grid>
      </Grid>
    </SimpleForm>
  );
};

AddToList.propTypes = {
  setFcType: PropTypes.func.isRequired,
  onAddToList: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default AddToList;
