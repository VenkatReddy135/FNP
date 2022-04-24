/* eslint-disable react/jsx-props-no-spreading */
import { Grid, Typography, Divider } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Create,
  SaveButton,
  SimpleForm,
  Toolbar,
  useMutation,
  useNotify,
  useQueryWithStore,
  useRedirect,
  useTranslate,
} from "react-admin";
import { useLocation } from "react-router-dom";
import SimpleModel from "../../../components/CreateModal";
import GenericField from "../../../components/GenericField";
import LoaderComponent from "../../../components/LoaderComponent";
import Breadcrumbs from "../../../components/Breadcrumbs";
import cockpitConfig from "../../../config/CockpitConfig";
import { TIMEOUT } from "../../../config/GlobalConfig";
import CommonDialogContent from "../../../components/CommonDialogContent";
import useStyles from "../../../assets/theme/common";
import getDbTypeKey from "../CockpitHelper/helper";

/**
 * Function to Create the Field based on selected entity name and selected entity column.
 *
 * @param {object} props object which is required dependencies for Entity Create Component.
 * @param {string} props.resource Set the url
 * @function EntityCreate Component used to create new field based on selected entity from the Entity Engine List.
 * @returns {React.ReactElement} react-admin resource.
 */
const EntityCreate = (props) => {
  const { resource } = props;
  const classes = useStyles();
  const [configForEntitySqlForm, setConfigForEntitySqlForm] = useState([]);
  const [configForEntityNoSqlForm, setConfigForEntityNoSqlForm] = useState([]);
  const [entityColumnMetaData, setEntityColumnMetaData] = useState([]);
  const [initialEntityFormData, setInitialEntityFormData] = useState();
  const [formData, setFormData] = useState();
  const [open, toggleModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const translate = useTranslate();
  const createValue = translate("createValue");
  const redirect = useRedirect();
  const notify = useNotify();

  const [breadcrumbsList] = useState([
    {
      displayName: translate("entityEngineGridTitle"),
      navigateTo: `/${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
    },
    {
      displayName: createValue,
    },
  ]);

  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const [entityGroupName, entityName] = (query.get("entityId") || "").split("|");
  const dbType = query.get("dbType");

  useEffect(() => {
    if (!(entityGroupName && entityName && dbType)) {
      redirect(`${window.REACT_APP_COCKPIT_SERVICE}entitygroups`);
    }
  });

  const { entityMetaDataLoading } = useQueryWithStore(
    {
      type: "getData",
      payload: { entityName, entityGroupName },
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/meta-data?`,
    },
    {
      onSuccess: (res) => {
        if (res.data?.data) {
          setEntityColumnMetaData([...res.data?.data]);
          if (dbType === cockpitConfig.dbType.mysql) {
            const metaData = res.data?.data.map(({ fieldName, fieldType }) => {
              return {
                source: fieldName,
                label: fieldName,
                fieldType,
                disabled: [...cockpitConfig.sqlDisabledValues].includes(fieldName),
              };
            });
            setConfigForEntitySqlForm([...metaData]);
          } else {
            setConfigForEntityNoSqlForm(
              res.data?.data.reduce((cur, ac) => {
                return { ...cur, [ac.fieldName]: "" };
              }, {}),
            );
          }
        }
      },
      onFailure: () => {
        notify(translate("somethingWrong"), "error", TIMEOUT);
      },
    },
  );

  useEffect(() => {
    if (entityColumnMetaData) {
      const initialValues = entityColumnMetaData.reduce((cur, ac) => {
        return { ...cur, [ac.fieldName]: "" };
      }, {});
      if (dbType === cockpitConfig.dbType.mysql) {
        setInitialEntityFormData(initialValues);
      } else {
        setInitialEntityFormData({ document: configForEntityNoSqlForm });
      }
    }
  }, [entityColumnMetaData, configForEntitySqlForm, configForEntityNoSqlForm, dbType]);

  const [createEntity] = useMutation(
    {
      type: "create",
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/query`,
      payload: {
        data: {
          dataObj: {
            queryPart: {
              operation: cockpitConfig.crudOperationType.insert,
              parameters: formData,
            },
          },
          params: {
            entityGroupName,
            entityName,
          },
        },
      },
    },
    {
      onSuccess: (response) => {
        if (response.data && response.status === "success") {
          redirect(`/${resource}${search}`);
          notify(response?.data?.message || translate("create_entity_success_message"), "success", TIMEOUT);
          toggleModal(false);
        } else if (
          response.data &&
          response.data.errors &&
          response.data.errors[0].errorCode &&
          response.data.errors[0].message
        ) {
          toggleModal(false);
          notify(
            response.data.errors[0].field
              ? `${response.data.errors[0].field} ${response.data.errors[0].message}`
              : `${response.data.errors[0].message}`,
          );
        }
      },
      onFailure: (error) => {
        notify(`${translate("error")}: ${error.message}`, "error", TIMEOUT);
        toggleModal(false);
      },
    },
  );
  /**
   * @function getDate function get the date format
   * @param {string} date string
   * @returns {string} formatted date
   */
  const getDate = (date) => {
    if (date) {
      return new Date(date).toISOString().replace(".000Z", "");
    }
    return date;
  };
  /**
   * @function cancelHandler function called on click of cancel button of Create Entity Page
   * @param {object} event event called on click of cancel
   */
  const cancelHandler = (event) => {
    event.preventDefault();
    redirect(`/${cockpitConfig.entitiesRoute}/query/select${search}`);
  };

  /**
   * @function dialogContent renders a Confirmation Dialog that opens on click of Create button
   * @param {string } message message to be displayed in the confirmation modal
   * @returns {React.createElement} returns Confirmation Dialog
   */
  const dialogContent = (
    <Grid className={classes.centerAlignContainer}>
      <CommonDialogContent message={translate("confirmation_create_new_entity")} />
    </Grid>
  );

  /**
   * Function getFormData to verify if id is not present
   *
   * @param {Array} modifiedValues is array of objects containing formData
   */
  const getFormData = (modifiedValues) => {
    const key = getDbTypeKey(dbType);
    const filteredValue = modifiedValues?.filter((i) => i.name === key);
    const disabled = filteredValue[0]?.value === "";
    setIsDisabled(disabled);
  };

  /**
   * Function onSubmit called onClick of Continue button of the popup modal
   *
   */
  const onSubmit = () => {
    if (isDisabled) {
      notify(`${getDbTypeKey(dbType)} ${translate("emptyField")}`, "warning", TIMEOUT);
      toggleModal(false);
    } else {
      createEntity();
    }
  };

  /**
   * Function to validate and call api to update data
   *
   * @param {object} formValues form data
   */
  const onSaveSimpleForm = (formValues) => {
    toggleModal(true);
    if (Object.keys(formValues).length > 0) {
      const modifiedValues = Object.keys(dbType === cockpitConfig.dbType.mysql ? formValues : formValues?.document).map(
        (key) => {
          const { fieldName: source, fieldType } = entityColumnMetaData?.find((item) => item.fieldName === key);
          if (fieldType === "DATETIME") {
            return {
              name: source,
              type: fieldType,
              value: dbType === cockpitConfig.dbType.mysql ? getDate(formValues[key]) : formValues.document[key],
            };
          }
          return {
            name: source,
            type: fieldType,
            value: dbType === cockpitConfig.dbType.mysql ? formValues[key] : formValues.document[key],
          };
        },
      );
      setFormData(modifiedValues);
      getFormData(modifiedValues);
    }
  };

  /**
   * @param {object} prop props
   * @returns {React.Component} return component
   */
  const CustomToolbar = (prop) => {
    return (
      <Toolbar {...prop}>
        <Button variant="outlined" label={translate("cancel")} onClick={cancelHandler} />
        <SaveButton label={translate("create")} icon={<></>} />
      </Toolbar>
    );
  };

  if (entityMetaDataLoading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <Grid item>
        <Typography className={classes.gridStyle}>{createValue}</Typography>
      </Grid>
      <Divider variant="fullWidth" />
      <Create {...props}>
        <SimpleForm
          initialValues={initialEntityFormData}
          submitOnEnter={false}
          save={onSaveSimpleForm}
          toolbar={<CustomToolbar />}
        >
          <Grid item container direction="row" alignItems="flex-start" justify="space-between" md={12}>
            <GenericField
              configForEntitySqlForm={configForEntitySqlForm}
              configForEntityNoSqlForm={configForEntityNoSqlForm}
              dbType={dbType}
            />
          </Grid>
        </SimpleForm>
      </Create>
      <SimpleModel
        dialogContent={dialogContent}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        openModal={open}
        handleClose={() => toggleModal(false)}
        handleAction={onSubmit}
      />
    </>
  );
};

EntityCreate.propTypes = {
  resource: PropTypes.string,
};

EntityCreate.defaultProps = {
  resource: "",
};

export default EntityCreate;
