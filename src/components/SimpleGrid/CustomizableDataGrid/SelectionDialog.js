import React from "react";
import PropTypes from "prop-types";
import { FieldTitle, useTranslate } from "react-admin";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import IconClose from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
/**
 * Selection dialogue function
 *
 * @param { * } props -Passing props value
 * @returns {undefined} return undefined.
 */
const SelectionDialog = (props) => {
  /**
   * Selection dialogue function
   *
   * @param { * } props -Passing props value
   * @returns {undefined} return undefined.
   */
  const onColumnClicked = ({ target: { value: columnName } }) => {
    props.onColumnClicked(columnName);
  };

  const translate = useTranslate();
  const { columns, selection, onClose, resource } = props;
  return (
    <Dialog maxWidth="xs" aria-labelledby="ra-columns-dialog-title" onClose={onClose} open>
      <DialogTitle id="ra-columns-dialog-title">{translate("configuration")}</DialogTitle>
      <DialogContent>
        <FormGroup>
          {columns.map(({ source, label, type }) => {
            const flag = type === "KebabMenuWithLink";
            return (
              <FormControlLabel
                key={source}
                control={
                  <Checkbox disabled={flag} checked={!!selection[source]} onChange={onColumnClicked} value={source} />
                }
                label={<FieldTitle label={label} source={source} resource={resource} />}
              />
            );
          })}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          <IconClose />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SelectionDialog.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      source: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selection: PropTypes.objectOf(
    PropTypes.shape({
      campaignName: PropTypes.bool,
      geo: PropTypes.bool,
      keyword: PropTypes.bool,
      targetUrl: PropTypes.bool,
      validFrom: PropTypes.bool,
      validThru: PropTypes.bool,
    }),
  ).isRequired,
  onColumnClicked: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  resource: PropTypes.string,
};
SelectionDialog.defaultProps = {
  resource: "",
};
export default SelectionDialog;
