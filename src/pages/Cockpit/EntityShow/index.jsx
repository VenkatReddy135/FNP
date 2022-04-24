/* eslint-disable react/jsx-props-no-spreading */
import { Grid, Typography, Divider, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Create,
  SimpleForm,
  useMutation,
  useNotify,
  useQueryWithStore,
  useRedirect,
  useTranslate,
} from "react-admin";
import { useLocation, Link } from "react-router-dom";
import SimpleModel from "../../../components/CreateModal";
import GenericField from "../../../components/GenericField";
import LoaderComponent from "../../../components/LoaderComponent";
import DevTools from "../../../components/DevTools";
import cockpitConfig from "../../../config/CockpitConfig";
import CommonDialogContent from "../../../components/CommonDialogContent";
import Breadcrumbs from "../../../components/Breadcrumbs";
import useStyles from "../../../assets/theme/common";
import { TIMEOUT } from "../../../config/GlobalConfig";
import getDbTypeKey from "../CockpitHelper/helper";

const defaultTabValue = 0;

/**
 * Function to Show the Entity field based on selected Entity and Entity Engine Group.
 *
 * @param {object} props having all the dependencies required with entity show.
 * @param {string}props.id This is id entity
 * @param {string}props.resource This is entity name.
 * @function EntityShow
 * @returns {React.ReactElement} react-admin resource.
 */
const EntityShow = (props) => {
  const { id: rowId, resource } = props;
  const [configForEntitySqlForm, setConfigForEntitySqlForm] = useState([]);
  const [configForEntityNoSqlForm, setConfigForEntityNoSqlForm] = useState([]);
  const [initialEntityFormData, setInitialEntityFormData] = useState();
  const [open, toggleModal] = useState(false);
  const [tabValue, setTabValue] = useState(defaultTabValue);

  const classes = useStyles();
  const translate = useTranslate();
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
      redirect(`/${cockpitConfig.entityGroupsRoute}`);
    }
  }, [entityGroupName, entityName, dbType, redirect]);

  const { loading } = useQueryWithStore(
    {
      type: "getData",
      payload: { entityName, entityGroupName },
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/meta-data`,
    },
    {
      onSuccess: (res) => {
        if (res.data?.data) {
          if (dbType === cockpitConfig.dbType.mysql) {
            const metaData = res.data?.data.map(({ fieldName, fieldType }) => {
              return {
                source: fieldName,
                label: fieldName,
                fieldType,
                disabled: true,
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
      onFailure: (error) => notify(`${translate("error")}: ${error.message}`, "error", TIMEOUT),
    },
  );

  /**
   * @function dialogContent renders a Confirmation Dialog that opens on click of Create button
   * @param {string } message message to be displayed in the confirmation modal
   * @returns {React.createElement} returns Confirmation Dialog
   */
  const dialogContent = (
    <Grid className={classes.centerAlignContainer}>
      <CommonDialogContent message={translate("confirmation_delete_new_entity")} />
    </Grid>
  );

  if (loading || entityDataLoading || !initialEntityFormData) {
    return <LoaderComponent />;
  }

  /**
   * @function onHandleTabChange handles the tab navigation.
   * @param { object } event Object shows the event data.
   * @param {number} newValue holds the index number of tabs to navigate.
   */
  const onHandleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box marginBottom="10px">
        <Breadcrumbs breadcrumbs={breadcrumbsList} />
      </Box>
      <Grid container direction="row" alignItems="flex-start" justify="space-between">
        <Typography className={classes.gridStyle}>{entityName}</Typography>
        <Grid>
          <Button
            color="gray"
            component={Link}
            to={{
              pathname: `/${resource}/${rowId}`,
              search: `${search}`,
            }}
          >
            <EditOutlinedIcon color="gray" />
          </Button>
          <Button onClick={() => toggleModal(true)} color="gray">
            <DeleteOutlineOutlinedIcon />
          </Button>
        </Grid>
      </Grid>
      <Divider variant="fullWidth" />
      <Create {...props}>
        <SimpleForm initialValues={initialEntityFormData} toolbar={<></>} submitOnEnter={false}>
          <Grid item container direction="row" alignItems="flex-start" justify="space-between" md={12}>
            <GenericField
              configForEntitySqlForm={configForEntitySqlForm}
              configForEntityNoSqlForm={configForEntityNoSqlForm}
              dbType={dbType}
              disabled
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
        handleAction={deleteEntity}
      />
      <DevTools
        tabValue={tabValue}
        initialEntityFormData={initialEntityFormData}
        identValue={2}
        onHandleTabChange={onHandleTabChange}
      />
    </>
  );
};

EntityShow.propTypes = {
  id: PropTypes.string.isRequired,
  resource: PropTypes.string,
};

EntityShow.defaultProps = {
  resource: "",
};
export default EntityShow;
