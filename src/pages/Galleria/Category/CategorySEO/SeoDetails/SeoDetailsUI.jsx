/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { useTranslate, TextInput, SimpleForm, SelectInput, Toolbar, Button } from "react-admin";
import { Grid, Typography, IconButton } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import useStyles from "../../../../../assets/theme/common";
import CustomArrayIterator from "../../../../../components/CustomArrayIterator";
import LoaderComponent from "../../../../../components/LoaderComponent";

/**
 * CustomToolbar for Category Seo View/Edit component
 *
 * @param {*} props all the toolbarProps required by CustomToolbar of Category Seo View/Edit component
 * @returns {React.ReactElement} CustomToolbar of Category Seo View/Edit component
 */
const CustomToolbar = (props) => {
  const { handleAddUpdateClick, handleCancelClick } = props;
  const translate = useTranslate();
  const classes = useStyles();
  return (
    <Toolbar {...props} className={classes.toolbar}>
      <Button variant="outlined" data-at-id="seoCancelbtn" label={translate("cancel")} onClick={handleCancelClick} />
      <Button
        variant="contained"
        data-at-id="seoUpdatebtn"
        label={translate("update")}
        onClick={handleAddUpdateClick}
      />
    </Toolbar>
  );
};

/**
 * Component to render the View/Edit Page UI for Category SEO Management
 *
 * @param {*} props props for category SEO
 * @returns {React.ReactElement} category SEO view
 */
const SeoDetailsUI = (props) => {
  const {
    editMode,
    relData,
    canonicalOptions,
    editSeoHandler,
    addUpdateHandler,
    handleTextInputChange,
    handleSelectInputChange,
    deleteClick,
    addClick,
    cancelHandler,
    relAltUpdatedData,
    seoObj,
    loading,
  } = props;
  const classes = useStyles();
  const translate = useTranslate();

  /**
   * @function renderTitle function to render a relHref title
   * @returns {React.ReactElement} history object
   */
  const renderTitle = () => {
    let title = (
      <Grid className={classes.gridContainer} container direction="row">
        <Typography variant="subtitle1">{translate("href_title")}</Typography>
      </Grid>
    );
    if (
      (editMode && relData.length === 0) ||
      (!editMode && seoObj?.relAltAssociations && seoObj.relAltAssociations.length === 0)
    ) {
      title = null;
    }
    return title;
  };

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <SimpleForm
          toolbar={
            editMode ? (
              <CustomToolbar
                toolbar={classes.toolbar}
                handleAddUpdateClick={addUpdateHandler}
                handleCancelClick={cancelHandler}
              />
            ) : null
          }
          initialValues={seoObj}
          className={!editMode ? classes.disabled : null}
        >
          <Grid
            item
            container
            direction="row"
            alignItems="flex-start"
            justify="space-between"
            className={classes.gridContainer}
          >
            <Grid container direction="row" justify-content="space-between">
              <Typography variant="subtitle1">{translate("seo_title")}</Typography>
              {editMode ? null : (
                <IconButton onClick={editSeoHandler} className={classes.buttonAlignment}>
                  <EditOutlinedIcon data-at-id="seoEdit" />
                </IconButton>
              )}
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            alignItems="flex-start"
            justify="space-between"
            className={classes.gridContainer}
            md={6}
          >
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <SelectInput
                source="canonical.type"
                choices={canonicalOptions}
                variant="standard"
                label={translate("canonical_type")}
                className={classes.autoCompleteItem}
                data-at-id="seoCanType"
                disabled={!editMode}
                InputProps={!editMode ? { disableUnderline: true } : { disableUnderline: false }}
                onChange={(event) => {
                  seoObj.canonical.type = event.target.value;
                }}
              />
            </Grid>
            <Grid item container direction="column" justify="flex-start" alignItems="flex-start" xs>
              <TextInput
                source="canonical.url"
                label={translate("canonical_url")}
                variant="standard"
                className={classes.canonicalUrl}
                title={seoObj.canonical.url}
                data-at-id="seoCanUrl"
                disabled={!editMode}
                autoComplete="off"
                InputProps={!editMode ? { disableUnderline: true } : { disableUnderline: false }}
                onChange={(event) => {
                  seoObj.canonical.url = event.target.value;
                }}
              />
            </Grid>
          </Grid>
          <>
            {renderTitle()}
            {seoObj?.relAltAssociations?.map((data, index) => (
              <CustomArrayIterator
                key={data.hrefLang}
                index={index}
                selectInputValue={data.hrefLang}
                textInputValue={data.href}
                optionsData={relData}
                editMode={editMode}
                selectInputLabel={translate("href_lang")}
                deleteClick={deleteClick}
                addClick={addClick}
                isDisplayDeleteButton={editMode}
                handleSelectInputChange={handleSelectInputChange}
                handleTextInputChange={handleTextInputChange}
                textInputLabel={translate("href")}
                isHideArrowIcon={!editMode}
                isDisabled={!editMode}
              />
            ))}
            <IconButton
              style={{
                color: "#FF9212",
                strokeWidth: "1",
                display: editMode && relAltUpdatedData.length !== relData.length ? "block" : "none",
              }}
              onClick={() => addClick()}
            >
              <AddBoxOutlinedIcon />
            </IconButton>
          </>
        </SimpleForm>
      )}
    </>
  );
};

CustomToolbar.propTypes = {
  handleAddUpdateClick: PropTypes.func,
  handleCancelClick: PropTypes.func,
};

CustomToolbar.defaultProps = {
  handleAddUpdateClick: () => {},
  handleCancelClick: () => {},
};

SeoDetailsUI.propTypes = {
  editMode: PropTypes.bool.isRequired,
  canonicalOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  relData: PropTypes.arrayOf(PropTypes.any).isRequired,
  editSeoHandler: PropTypes.func,
  addUpdateHandler: PropTypes.func,
  handleTextInputChange: PropTypes.func,
  handleSelectInputChange: PropTypes.func,
  deleteClick: PropTypes.func,
  addClick: PropTypes.func,
  cancelHandler: PropTypes.func,
  relAltUpdatedData: PropTypes.arrayOf(PropTypes.any).isRequired,
  seoObj: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.bool.isRequired,
};

SeoDetailsUI.defaultProps = {
  handleTextInputChange: () => {},
  handleSelectInputChange: () => {},
  deleteClick: () => {},
  addClick: () => {},
  editSeoHandler: () => {},
  addUpdateHandler: () => {},
  cancelHandler: () => {},
};

export default React.memo(SeoDetailsUI);
