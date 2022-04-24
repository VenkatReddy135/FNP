/**
 * Using ...item so that all the properties can be spread as a props and doesnot require any changes to prop passing
 *
 */
/* eslint-disable react/jsx-props-no-spreading */
import { Button, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { required, SimpleForm, useMutation, useNotify, useQueryWithStore, useTranslate } from "react-admin";
import BoundedCheckBoxDropdown from "../../../../components/BoundedCheckBoxDropdown";
import DropDownText from "../../../../components/Dropdown";
import { TIMEOUT } from "../../../../config/GlobalConfig";
import { onFailure, onSuccess } from "../../../../utils/CustomHooks";
import useFormValidity from "../../PromotionHelper/useFormValidity";
import useRenderInput from "../../PromotionHelper/useRenderInput";
import useUpdateForm from "../../PromotionHelper/useUpdateForm";
import validators from "../../PromotionHelper/validator";
import useStyles from "../../style";
import CriteriaCondition from "./CriteriaCondition";

/**
 * @function Criteria Component used to show input field to be filled for Promotion.
 * @param {object} props object which is required dependencies for BasicProperties Component.
 * @param {boolean} props.edit decides whether to show editable field or not.
 * @param {boolean} props.create decides whether component is used for creating or viewing purpose.
 * @param {object} props.formValues have the master forms values.
 * @param {React.DispatchWithoutAction} props.updateMasterForm update master forms values.
 * @param {React.DispatchWithoutAction} props.updateMasterFormValidity update the validation of form.
 * @returns {React.ReactElement} react-admin resource.
 */
const Criteria = (props) => {
  const { edit, create, formValues, updateMasterForm, updateMasterFormValidity } = props;

  const notify = useNotify();

  const [mutate] = useMutation();

  const [domainOptions, setDomainOptions] = useState([]);

  const [geoOptions, setGeoOptions] = useState([]);

  const [criteriaConfigs, setCriteriaConfigs] = useState([]);

  const [conditionsData, setConditionsData] = useState(formValues.criteria);

  const [allSelectedCondition, setAllSelectedCondition] = useState([]);

  const isMounted = useRef(true);

  const classes = useStyles();
  const translate = useTranslate();

  const [handleChange] = useUpdateForm(updateMasterForm);

  const [renderInput, reMount] = useRenderInput();

  /**
   * @function handleCriteriaConfigSuccess handle the success of criteria condition api call.
   * @param {object} res contains value to be used in the form.
   */
  const handleCriteriaConfigSuccess = useCallback(
    (res) => {
      if (res.data?.data) {
        const config = res.data.data;
        const childMap = {};
        config.forEach((item) => {
          if (item?.parentId) {
            if (!childMap[item.parentId]) {
              childMap[item.parentId] = [];
            }
            childMap[item.parentId].push(item.id);
          }

          if (item.conditionName === "DOMAIN") {
            updateMasterForm({ type: "field", payload: { fieldName: "domainConditionId", value: item.id } });
          }

          if (item.conditionName === "GEO") {
            updateMasterForm({ type: "field", payload: { fieldName: "geoConditionId", value: item.id } });
          }
        });

        setCriteriaConfigs(
          config.map((item) =>
            childMap[item.id] ? { ...item, children: childMap[item.id] } : { ...item, children: [] },
          ),
        );
      }
    },
    [updateMasterForm],
  );

  /**
   * @function handleDomainListSuccess handle the success of domain list api call.
   * @param {object} res contains value to be used in the form.
   */
  const handleDomainListSuccess = (res) => {
    if (res?.data?.data) {
      setDomainOptions(res.data.data.map((item) => ({ id: item.domainId, name: item.domainId })));
    }
  };

  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/primary-domain-geo`,
      payload: {},
    },
    {
      onSuccess: (response) => {
        onSuccess({ response, notify, translate, handleSuccess: handleDomainListSuccess });
      },
      onFailure: (error) => {
        onFailure({ error, notify, translate });
      },
    },
  );

  /**
   * @function handleGeoListSuccess handle the success of geo list api call.
   * @param {object} res contains value to be used in the form.
   */
  const handleGeoListSuccess = (res) => {
    const geoValues = [];
    if (res.data?.data) {
      res.data.data.forEach((geo) => {
        geoValues.push({ id: geo.geoId, name: geo.geoName });
      });
    }
    setGeoOptions(geoValues);
  };

  /**
   * @function handleGeoListFailure handle the failure of geo list api call.
   */
  const handleGeoListFailure = useCallback(() => {
    setGeoOptions([]);
    notify(translate("indexable_attribute.geo_error_message"), "error", TIMEOUT);
  }, [notify, translate]);

  /**
   * @function getGeoListAPICall to call the geo list api.
   */
  const getGeoListAPICall = useCallback(() => {
    mutate(
      {
        type: "getOne",
        resource: `${window.REACT_APP_GALLERIA_SERVICE}/geographies?domainId=${formValues.domainId}`,
        payload: {},
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleGeoListSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate, handleFailure: handleGeoListFailure });
        },
      },
    );
  }, [formValues.domainId, handleGeoListFailure, notify, mutate, translate]);

  useEffect(() => {
    if (isMounted.current && formValues.domainId) {
      getGeoListAPICall();
    }
  }, [formValues.domainId, getGeoListAPICall]);

  const [updateFormValidity] = useFormValidity({
    initialForm: {
      criteria: {
        status: false,
        validations: [
          validators.required("domainId"),
          validators.noEmptyArray("geoId"),
          validators.checkForNoNullEntry("criteria", { values: ["conditionId", "operator", "values"] }),
        ],
      },
    },
  });

  /**
   * @function validateForm validate the required values and update the master form validity.
   * @param {object} values contains the values of form to be validated.
   * @returns {object} returns error if any.
   */
  const validateForm = useCallback(() => {
    const errors = {};

    updateMasterFormValidity({
      type: "validity",
      formType: "criteria",
      payload: updateFormValidity(formValues)?.criteria,
    });

    return errors;
  }, [updateFormValidity, updateMasterFormValidity, formValues]);

  /**
   * @function resetFields to reset the field that are not involved in the form.
   * @param {object} payload has field config to be reset
   */
  const resetFields = useCallback(
    (payload) => {
      updateMasterForm({
        type: "resetActionFields",
        payload,
      });
    },
    [updateMasterForm],
  );

  /**
   * @function onDomainChangeHandler handle the required task when domain changes.
   * @param {object} e event vallue
   */
  const onDomainChangeHandler = useCallback(
    (e) => {
      handleChange({ fieldName: "domainId" }, e);
      resetFields({
        fieldNamesConfig: [
          {
            fieldName: "geoId",
            value: [],
          },
          {
            fieldName: "criteria",
            value: [],
          },
        ],
      });
      reMount();
      setConditionsData([]);
    },
    [handleChange, reMount, resetFields],
  );

  /**
   * @function onGeoChangeHandler handle the required task when domain changes.
   * @param {object} e event vallue
   */
  const onGeoChangeHandler = useCallback(
    (e) => {
      handleChange({ fieldName: "geoId" }, e);
      resetFields({
        fieldNamesConfig: [
          {
            fieldName: "criteria",
            value: [],
          },
        ],
      });
      setConditionsData([]);
    },
    [handleChange, resetFields],
  );

  /**
   * @function getCriteriaConfigsAPICall calls the api that get the criteria config data.
   */
  const getCriteriaConfigsAPICall = useCallback(() => {
    const params = {
      sortParam: `conditionName:desc`,
      size: 100,
    };
    mutate(
      {
        type: "getOne",
        resource: `${window.REACT_APP_MINECRAFT_SERVICE}/criterias`,
        payload: params,
      },
      {
        onSuccess: (response) => {
          onSuccess({
            response,
            notify,
            translate,
            handleSuccess: handleCriteriaConfigSuccess,
          });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  }, [notify, mutate, translate, handleCriteriaConfigSuccess]);

  useEffect(() => {
    if (isMounted.current && formValues.domainId && !!formValues.geoId?.length) {
      getCriteriaConfigsAPICall();
    }
  }, [formValues.domainId, formValues.geoId.length, getCriteriaConfigsAPICall]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * @function addConditionData add new entry in the criteria conditions
   * @param {object} data has information
   */
  const addConditionData = (data) => {
    const childIndex = data ? data.childIndex : 0;
    const parentId = data ? data.parentId : null;
    const index = data ? data.index + 1 : null;
    const subConditionCount = data ? data.subConditionCount : 0;
    const parentValue = parentId ? conditionsData.find((item) => item.conditionId === parentId).values[0] : null;
    const idx = `CRITERIA_${new Date().getTime()}`;

    const newEntry = {
      id: idx,
      conditionId: null,
      childIndex,
      subConditionCount: 0,
      parentId,
      parentValue,
      operator: null,
      values: [],
    };

    if (index) {
      const newConditionsData = [...conditionsData];
      newConditionsData.splice(index, 0, newEntry);
      setConditionsData(
        newConditionsData.map((item) => (item.conditionId === parentId ? { ...item, subConditionCount } : item)),
      );
    } else {
      const newConditionsData = [...conditionsData, newEntry];
      setConditionsData(
        newConditionsData.map((item) => (item.conditionId === parentId ? { ...item, subConditionCount } : item)),
      );
    }
  };

  /**
   * @function updateConditionData handle the updation of the conditions data.
   * @param {object} event target event value
   * @param {object} value contains fieldname and fieldvalue
   */
  const updateConditionData = useCallback(
    (event, value) => {
      let data;
      if (value.fieldName === "conditionId") {
        const prevConditionData = conditionsData.find((item) => item.id === value.id);
        data = conditionsData.map((item) =>
          item.id === value.id
            ? {
                ...item,
                [value.fieldName]: value.fieldValue || event.target?.value,
                subConditionCount: 0,
                operator: null,
                values: [],
              }
            : item,
        );
        data.splice(conditionsData.indexOf(prevConditionData) + 1, prevConditionData.subConditionCount);
      } else if (value.fieldName === "operator") {
        data = conditionsData.map((item) =>
          item.id === value.id
            ? { ...item, [value.fieldName]: value.fieldValue || event.target?.value, values: [] }
            : item,
        );
      } else {
        const currentCriteria = conditionsData.find((item) => item.id === value.id);
        const childCount = currentCriteria.subConditionCount;
        const index = conditionsData.indexOf(currentCriteria);

        data = conditionsData.map((item) =>
          item.id === value.id
            ? { ...item, [value.fieldName]: value.fieldValue || event.target?.value, subConditionCount: 0 }
            : item,
        );

        if (childCount) {
          data.splice(index + 1, childCount);
        }
      }
      setConditionsData(data);
    },
    [conditionsData],
  );

  useEffect(() => {
    if (conditionsData) {
      updateMasterForm({ type: "field", payload: { fieldName: "criteria", value: conditionsData } });
    }
    setAllSelectedCondition(conditionsData.map((item) => item.conditionId));
  }, [conditionsData, updateMasterForm]);

  /**
   * @function deleteCondition handle the deletion of the conditions data.
   * @param {number} index index of element to be deleted
   */
  const deleteCondition = useCallback(
    (index) => {
      let newConditionsData = [...conditionsData];

      const { parentId, conditionId } = conditionsData[index];
      if (parentId) {
        newConditionsData = newConditionsData.map((item) =>
          item.conditionId === parentId ? { ...item, subConditionCount: item.subConditionCount - 1 } : item,
        );
      }
      newConditionsData.splice(index, 1);
      setConditionsData(
        newConditionsData.reduce(
          (prev, curr) => (curr.parentId && curr.parentId === conditionId ? prev : [...prev, curr]),
          [],
        ),
      );
    },
    [conditionsData],
  );

  /**
   * @function updateSubCondition handle the deletion of the conditions data.
   * @param {object} data had required infomation for subcondition addition.
   */
  const updateSubCondition = (data) => {
    addConditionData(data);
  };

  /**
   * @function showAddConditionBtn To check whether to show add sub condition button.
   * @returns {boolean} return condition.
   */
  const showAddConditionBtn = () => {
    const noOfCond = criteriaConfigs.filter(
      (item) =>
        !(
          item.parentId ||
          allSelectedCondition.includes(item.id) ||
          item.conditionName === "GEO" ||
          item.conditionName === "DOMAIN"
        ),
    );

    if (!noOfCond.length) {
      return false;
    }
    let flag = true;
    conditionsData.forEach((item) => {
      if (!item.parentId && (!item.conditionId || !item.operator || item.values.length === 0)) {
        flag = false;
      }
      item.values.forEach((value) => {
        if (!value) {
          flag = false;
        }
      });
    });
    return flag;
  };

  return (
    <>
      <SimpleForm
        initialValues={formValues}
        toolbar={<></>}
        validate={validateForm}
        className={classes.criteriaForm}
        data-testid="criteriaCondition"
      >
        <Grid
          item
          container
          direction="row"
          alignItems="flex-start"
          justify="flex-start"
          md={create ? 9 : 10}
          className={classes.gridGap}
        >
          <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
            <DropDownText
              source="domainId"
              label={translate("promotion_domain")}
              variant="standard"
              edit={edit}
              value={formValues?.domainId}
              data={domainOptions}
              onSelect={onDomainChangeHandler}
              validate={required()}
            />
          </Grid>

          <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
            {edit && renderInput ? (
              <BoundedCheckBoxDropdown
                id="geoId"
                source="geoId"
                type="select"
                label={translate("promotion_geo")}
                variant="standard"
                selectAll
                options={geoOptions}
                onChange={onGeoChangeHandler}
                className={classes.geo}
                validate={required()}
              />
            ) : (
              <Grid item md={12}>
                <Typography variant="caption">{translate("promotion_geo")}</Typography>
                <Typography variant="h6">{formValues.geoId.join("; ")}</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        {conditionsData.map((item, idx) => (
          <CriteriaCondition
            id={item.id}
            key={item.id}
            index={idx}
            updateConditionData={updateConditionData}
            deleteCondition={deleteCondition}
            criteriaConfigs={criteriaConfigs}
            allSelectedCondition={allSelectedCondition}
            updateSubCondition={updateSubCondition}
            formValues={formValues}
            edit={edit}
            create={create}
            showAddConditionBtn={showAddConditionBtn}
            addConditionData={addConditionData}
            {...item}
          />
        ))}

        {edit && formValues.domainId && !!formValues.geoId?.length && showAddConditionBtn() && (
          <>
            {conditionsData.length === 0 && (
              <Button variant="outlined" size="large" className={classes.addCodeBtn} onClick={() => addConditionData()}>
                {translate("promotion_add_condition")}
              </Button>
            )}
          </>
        )}
      </SimpleForm>
    </>
  );
};

Criteria.propTypes = {
  edit: PropTypes.bool,
  create: PropTypes.bool,
  formValues: PropTypes.objectOf(PropTypes.any).isRequired,
  updateMasterForm: PropTypes.func.isRequired,
  updateMasterFormValidity: PropTypes.func,
};

Criteria.defaultProps = {
  edit: true,
  create: true,
  updateMasterFormValidity: () => {},
};

export default Criteria;
