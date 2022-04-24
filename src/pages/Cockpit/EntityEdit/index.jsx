/* eslint-disable react/jsx-props-no-spreading */
import { Grid, Typography, Divider, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import React, { useEffect, useMemo, useState } from "react";
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
import cockpitConfig from "../../../config/CockpitConfig";
import CommonDialogContent from "../../../components/CommonDialogContent";
import Breadcrumbs from "../../../components/Breadcrumbs";
import useStyles from "../../../assets/theme/common";
import { TIMEOUT } from "../../../config/GlobalConfig";
import getDbTypeKey from "../CockpitHelper/helper";

/**
 * Function to Edit the Entity field based on selected Entity and Entity Engine Group.
 *
 * @param {object} props contains data related to Entity Edit
 * @param {string} props.id this is id of entity
 * @param {string} props.resource this is url of entity
 * @function EntityEdit
 * @returns {React.ReactElement} react-admin resource.
 */
const EntityEdit = (props) => {
  const { id: rowId, resource } = props;
  const [configForEntitySqlForm, setConfigForEntitySqlForm] = useState([]);
  const [configForEntityNoSqlForm, setConfigForEntityNoSqlForm] = useState([]);
  const [entityColumnMetaData, setEntityColumnMetaData] = useState([]);
  const [initialEntityFormData, setInitialEntityFormData] = useState();
  const [actionType, setActionType] = useState("Edit");
  const [open, toggleModal] = useState(false);
  const [formData, setFormData] = useState();
  const classes = useStyles();

  const translate = useTranslate();
  const editValue = translate("editValue");

  const redirect = useRedirect();
  const notify = useNotify();

  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const [entityGroupName, entityName] = (query.get("entityId") || "").split("|");
  const dbType = query.get("dbType");

  const [breadcrumbsList] = useState([
    {
      displayName: translate("entityEngineGridTitle"),
      navigateTo: `/${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
    },
    {
      displayName: entityName,
      navigateTo: `/${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/query/select?dbType=${dbType}&entityId=${entityGroupName}|${entityName}`,
    },
    {
      displayName: rowId,
    },
  ]);

  useEffect(() => {
    if (!(entityGroupName && entityName && dbType)) {
      redirect(`/cockpit`);
    }
  }, [entityGroupName, entityName, dbType, redirect]);

  const { loading: entityMetaDataLoading } = useQueryWithStore(
    {
      type: "getData",
      payload: { entityName, entityGroupName },
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/meta-data`,
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

  const filterData = {
    conditions: [
      {
        name: getDbTypeKey(dbType),
        operation: "In",
        type: "string",
        values: [rowId],
      },
    ],
  };

  const { loading: entityDataLoading } = useQueryWithStore(
    {
      type: "getOne",
      resource,
      payload: {
        entityGroupName,
        entityName,
        filter: btoa(JSON.stringify(filterData)),
      },
    },
    {
      onSuccess: (res) => {
        if (res.data?.data) {
          if (dbType === cockpitConfig.dbType.mysql) {
            setInitialEntityFormData(...res.data?.data);
          } else {
            setInitialEntityFormData({ document: res.data?.data[0] });
          }
        }
      },

      onFailure: () => {
        notify(translate("somethingWrong"), "error", TIMEOUT);
      },
    },
  );

  const [updateEntity] = useMutation(
    {
      type: "create",
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/query`,
      payload: {
        data: {
          dataObj: {
            queryPart: {
              condition: { [getDbTypeKey(dbType)]: rowId },
              operation: cockpitConfig.crudOperationType.edit,
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
          notify(response?.data?.message || translate("edit_entity_success_message"), "success", TIMEOUT);
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
        notify(`${translate("error")}: ${error.message}`, "warning", TIMEOUT);
        toggleModal(false);
      },
    },
  );

  const [deleteEntity] = useMutation(
    {
      type: "create",
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/query`,
      payload: {
        data: {
          dataObj: {
            queryPart: {
              condition: { [getDbTypeKey(dbType)]: rowId },
              operation: cockpitConfig.crudOperationType.delete,
              parameters: [],
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
          notify(response?.data?.message || translate("delete_entity_success_message"), "success", TIMEOUT);
          toggleModal(false);
          redirect(`/${resource}${search}`);
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
        notify(`${translate("error")}: ${error.message}`, "warning", TIMEOUT);
        toggleModal(false);
      },
    },
  );

  /**
   * @function cancelHandler function called on click of cancel button of Create Entity Page
   * @param {object} event event called on click of cancel
   */
  const cancelHandler = (event) => {
    event.preventDefault();
    setActionType("Edit");
    redirect(`/${resource}${search}`);
  };

  /**
   * @function dialogContent renders a Confirmation Dialog that opens on click of Create button
   * @param {string } message message to be displayed in the confirmation modal
   * @returns {React.createElement} returns Confirmation Dialog
   */
  const dialogContent = (
    <Grid className={classes.centerAlignContainer}>
      {!(actionType === "Edit") && <DeleteIcon className={classes.deleteIconStyle} />}
      <CommonDialogContent
        message={translate(actionType === "Edit" ? "confirmation_edit_new_entity" : "confirmation_delete_new_entity")}
      />
    </Grid>
  );

  /**
   * Function to validate and call api to update data
   *
   * @param {object} formValues form data
   */
  const updateUrlRedirectHandler = (formValues) => {
    toggleModal(true);
    const modifiedValues = Object.keys(dbType === cockpitConfig.dbType.mysql ? formValues : formValues.document).map(
      (key) => {
        const metaData = entityColumnMetaData?.find((item) => item.fieldName === key);
        if (metaData) {
          const { fieldName: source, fieldType } = metaData;
          return {
            name: source,
            type: fieldType,
            value: dbType === cockpitConfig.dbType.mysql ? formValues[key] : formValues.document[key],
          };
        }
        return {
          name: key,
          type: "VARCHAR",
          value: dbType === cockpitConfig.dbType.mysql ? formValues[key] : formValues.document[key],
        };
      },
    );
    setFormData(modifiedValues);
  };

  /**
   * @param {object} prop props
   * @returns {React.Component} return component
   */
  const CustomToolbar = (prop) => {
    return (
      <Toolbar {...prop}>
        <Button variant="outlined" label={translate("cancel")} onClick={cancelHandler} />
        <SaveButton label={translate("save")} icon={<></>} />
      </Toolbar>
    );
  };

  if (entityMetaDataLoading || entityDataLoading || !initialEntityFormData) {
    return <LoaderComponent />;
  }

  return (
    <>
      <Box marginBottom="10px">
        <Breadcrumbs breadcrumbs={breadcrumbsList} />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography className={classes.gridStyle}>{editValue}</Typography>
        </Grid>
        <Grid container xs={6} direction="row" justify="flex-end">
          <Button
            onClick={() => {
              setActionType("Delete");
              toggleModal(true);
            }}
            color="gray"
          >
            <DeleteOutlineOutlinedIcon />
          </Button>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" />
      <Create {...props}>
        <SimpleForm
          initialValues={initialEntityFormData}
          submitOnEnter={false}
          save={updateUrlRedirectHandler}
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
        handleClose={() => {
          setActionType("Edit");
          toggleModal(false);
        }}
        handleAction={actionType === "Edit" ? updateEntity : deleteEntity}
      />
    </>
  );
};

EntityEdit.propTypes = {
  id: PropTypes.string,
  resource: PropTypes.string,
};
EntityEdit.defaultProps = {
  resource: "",
  id: "",
};

export default EntityEdit;
