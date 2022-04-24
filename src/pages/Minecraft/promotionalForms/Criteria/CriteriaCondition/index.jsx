import { Button, Grid, IconButton, Typography } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import debounce from "lodash/debounce";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useNotify, useTranslate } from "react-admin";
import ApiQueryWrapper from "../../../../../components/ApiQueryWrapper";
import BoundedCheckBoxDropdown from "../../../../../components/BoundedCheckBoxDropdown";
import DateRangeInput from "../../../../../components/DateRangeInput";
import DropDownText from "../../../../../components/Dropdown";
import MultiSelectAutoComplete from "../../../../../components/MultiSelectAutoComplete";
import NumberRangeInput from "../../../../../components/NumberRangeInput";
import CustomTextInput from "../../../../../components/TextInput";
import GenericRadioGroup from "../../../../../components/RadioGroup";
import { DEBOUNCE_INTERVAL, TIMEOUT } from "../../../../../config/GlobalConfig";
import criteriaMappings from "../../../PromotionHelper/mapping";
import validator from "../../../PromotionHelper/validator";
import useStyles from "../../../style";

/**
 * @function CriteriaCondition Component used to show input field to be filled for Promotion.
 * @param {object} props object which is required dependencies for BasicProperties Component.
 * @param {boolean} props.edit decides whether to show editable field or not.
 * @param {boolean} props.create decides whether component is used for creating or viewing purpose.
 * @param {object} props.formValues have the master forms values.
 * @param {function(object,object):void} props.updateConditionData handle the updation of criteria condition.
 * @param {function(object,object):void} props.deleteCondition handle the deletion of criteria condition.
 * @param {function(object):void} props.addConditionData handle the addition of new entry in the criteria conditions.
 * @param {function():boolean} props.showAddConditionBtn handle whether to show add btn.
 * @param {Array} props.allSelectedCondition array conditionId of all selected condition.
 * @param {string} props.id id of selected entry form condition data array.
 * @param {object} props.index index of selected entry form condition data array.
 * @param {object} props.criteriaConfigs criteria conditions data.
 * @param {string} props.conditionId condition Id of selected entry form condition data array.
 * @param {Array} props.operator operators value of selected entry form condition data array.
 * @returns {React.ReactElement} react-admin resource.
 */
const CriteriaCondition = (props) => {
  const {
    edit,
    create,
    formValues,
    updateConditionData,
    deleteCondition,
    allSelectedCondition,
    id,
    index,
    criteriaConfigs,
    conditionId,
    operator,
    showAddConditionBtn,
    addConditionData,
    updateSubCondition,
    childIndex,
    subConditionCount,
    parentId,
  } = props;

  const classes = useStyles();
  const translate = useTranslate();
  const [mutate] = useMutation();
  const notify = useNotify();

  const conditionOptions = useMemo(() => {
    if (!parentId)
      return criteriaConfigs
        .filter((item) => !item.parentId && item.conditionName !== "DOMAIN" && item.conditionName !== "GEO")
        .map((item) => ({ id: item.id, name: item.conditionDisplayName }));

    const childOptionIdArray = criteriaConfigs?.find((item) => item.id === parentId)?.children;
    const { values } = formValues?.criteria?.find((item) => item.conditionId === parentId);

    return criteriaConfigs
      .filter((item) => childOptionIdArray?.includes(item.id) && values.includes(item.parentValue))
      .map((item) => ({ id: item.id, name: item.conditionDisplayName }));
  }, [criteriaConfigs, formValues.criteria, parentId]);

  const [operatorOptions, setOperatorOptions] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedOperator, setSelectedOperator] = useState(null);

  const [operatorFlag, setOperatorFlag] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    if (conditionId) {
      const selectedCriteriaConfig = criteriaConfigs.filter((item) => item.id === conditionId);
      setOperatorOptions(selectedCriteriaConfig[0]?.operators?.map((item) => ({ id: item, name: item })));
      setSelectedCategory(selectedCriteriaConfig[0]);
    }
  }, [conditionId, criteriaConfigs]);

  useEffect(() => {
    if (operator) {
      setSelectedOperator(operator);
    }
  }, [operator]);

  useEffect(() => {
    if (selectedOperator) {
      setOperatorFlag(true);
    }
  }, [selectedOperator]);

  /**
   * @function categoryOnInputChange handle onInputChange for category.
   * @param {object} e event.
   */
  const categoryOnInputChange = (e) => {
    if (e?.target?.value === "") return;

    const filter = [
      {
        fieldName: "categoryName",
        fieldValue: e.target.value,
        operatorName: "Like",
      },
      {
        fieldName: "domain",
        fieldValue: formValues.domainId,
        operatorName: "EqualTo",
      },
    ];

    const url = `${window.REACT_APP_GALLERIA_SERVICE}/categories?size=100&filter=${encodeURIComponent(
      JSON.stringify(filter),
    )}`;

    mutate(
      {
        type: "getData",
        resource: url,
        payload: {},
      },
      {
        onSuccess: (res) => {
          if (res.data && res.status === "success") {
            const options = res.data?.data?.map((item) => ({
              id: item.id,
              name: `${item.categoryName} [${item.categoryUrl}]`,
            }));
            setCategoryOptions(options);
          } else if (res.data && res.data.errors && res.data.errors[0] && res.data.errors[0].message) {
            notify(
              res.data.errors[0].field
                ? `${res.data.errors[0].field} ${res.data.errors[0].message}`
                : `${res.data.errors[0].message}`,
            );
          }
        },
        onFailure: (error) => {
          notify(`Error: ${error.message}`, "error", TIMEOUT);
        },
      },
    );
  };

  /**
   * @function categoryOnInputChangeDebounce handle debounce for categoryOnInputChange.
   * @param {object} e event.
   */
  const categoryOnInputChangeDebounce = debounce((e) => {
    categoryOnInputChange(e);
  }, DEBOUNCE_INTERVAL);

  /**
   * @function getMappedValues To map the type of input field to be shown.
   * @returns {React.ReactElement} react-admin resource.
   */
  const getMappedValues = () => {
    const selectedConfig = criteriaConfigs.filter((item) => item.conditionName === selectedCategory?.conditionName)[0];

    const { fieldInputType: fieldType, values } = selectedConfig;

    switch (fieldType) {
      case "WildcardSearch":
        return (
          <Grid item md={create ? 6 : 4} className={classes.maxWidthWrap}>
            <MultiSelectAutoComplete
              source={`criteria[${index}].values`}
              label={translate("promotion_value")}
              edit={edit}
              limitTags={2}
              dataId="baseCategory"
              apiParams={criteriaMappings[selectedCategory?.conditionName]?.apiParams}
              onOpen
              onChange={(e, newValue) => {
                updateConditionData(e, { fieldName: "values", id, fieldValue: newValue });
              }}
              optionsFromParentComponent={selectedCategory?.conditionName === "CATEGORY"}
              onChangeFromParentComponent={selectedCategory?.conditionName === "CATEGORY"}
              optionData={selectedCategory?.conditionName === "CATEGORY" ? categoryOptions : []}
              onInputChangeCall={selectedCategory?.conditionName === "CATEGORY" ? categoryOnInputChangeDebounce : null}
              emptySearch={
                !(
                  selectedCategory?.conditionName === "DELIVERY_CITY" ||
                  selectedCategory?.conditionName === "FROM_CITY" ||
                  selectedCategory?.conditionName === "PRODUCT"
                )
              }
            />
          </Grid>
        );
      case "FreeText": {
        return (
          <Grid item md={create ? 6 : 4} className={classes.maxWidthWrap}>
            <CustomTextInput
              source={`criteria[${index}].values`}
              label={translate("promotion_value")}
              autoComplete="off"
              variant="standard"
              edit={edit}
              value={formValues?.criteria[index]?.values}
              onChange={(e) => updateConditionData(e, { fieldName: "values", id, fieldValue: [e.target.value] })}
            />
          </Grid>
        );
      }
      case "NumericFreeText": {
        return selectedOperator === "between" ? (
          <Grid item md={create ? 6 : 4} className={classes.maxWidthWrap}>
            <NumberRangeInput
              source={`criteria[${index}].values`}
              edit={edit}
              onChange={(e) => {
                updateConditionData(e, { fieldName: "values", id });
              }}
              onKeyDown={(e) => {
                validator.numberInputValidation(e, Infinity, { isDecimalAllowed: true, isZeroAllowed: true });
              }}
              min={0}
            />
          </Grid>
        ) : (
          <Grid item md={create ? 6 : 4} className={classes.maxWidthWrap}>
            <CustomTextInput
              source={`criteria[${index}].values`}
              label={translate("promotion_value")}
              autoComplete="off"
              variant="standard"
              edit={edit}
              value={formValues?.criteria[index]?.values}
              type="number"
              min={0}
              onChange={(e) => updateConditionData(e, { fieldName: "values", id, fieldValue: [e.target.value] })}
              onKeyDown={(e) => {
                validator.numberInputValidation(e, Infinity, { isDecimalAllowed: true, isZeroAllowed: true });
              }}
            />
          </Grid>
        );
      }
      case "DatePicker": {
        return (
          <Grid item md={create ? 6 : 4} className={classes.maxWidthWrap}>
            <DateRangeInput
              source={`criteria[${index}].values`}
              edit={edit}
              onChange={(e) => {
                updateConditionData(e, { fieldName: "values", id });
              }}
              minDate={new Date(formValues.fromDate?.split("T")[0]).toISOString().split("T")[0]}
              maxDate={new Date(formValues.thruDate?.split("T")[0]).toISOString().split("T")[0]}
            />
          </Grid>
        );
      }
      case "Dropdown": {
        return (
          <>
            <Grid item md={create ? 6 : 4} className={classes.maxWidthWrap}>
              <ApiQueryWrapper
                source={`criteria[${index}].values`}
                label={translate("promotion_value")}
                as="dropdown"
                edit={edit}
                apiParams={
                  criteriaMappings[selectedCategory?.conditionName]?.apiParams
                    ? criteriaMappings[selectedCategory.conditionName].apiParams
                    : { defaultOptions: values?.map((item) => ({ id: item, name: item })) }
                }
                onSelect={(e) => {
                  updateConditionData(e, { fieldName: "values", fieldValue: [e.target.value], id });
                }}
              />
            </Grid>
          </>
        );
      }
      case "Checklist":
        return (
          <Grid item md={create ? 6 : 4} className={classes.maxWidthWrap}>
            {edit ? (
              <BoundedCheckBoxDropdown
                source={`criteria[${index}].values`}
                type="select"
                label={translate("promotion_value")}
                variant="standard"
                selectAll
                options={values ? [...values].map((item) => ({ id: item, name: item })) : []}
                onChange={(e) => {
                  updateConditionData(e, { fieldName: "values", id });
                }}
              />
            ) : (
              <Grid md={12}>
                <Typography variant="caption">{translate("promotion_value")}</Typography>
                <Typography variant="h6">{formValues.criteria[index].values.join("; ")}</Typography>
              </Grid>
            )}
          </Grid>
        );
      case "RadioButton":
        return (
          <Grid item md={create ? 6 : 4} className={classes.radioBtn}>
            <GenericRadioGroup
              label={translate("promotion_value")}
              source={`criteria[${index}].values[0]`}
              choices={values ? values.map((item) => ({ id: item, name: item })) : []}
              editable={edit}
              displayText={formValues?.criteria[index]?.values}
              onChange={(e) => updateConditionData(null, { fieldName: "values", fieldValue: [e], id })}
            />
          </Grid>
        );
      default:
        return <></>;
    }
  };

  /**
   * @function getPosition To get the position of add sub condition button.
   * @returns {number} position
   */
  const getPosition = () => {
    const noOfchild = formValues?.criteria[index].subConditionCount;
    return 77 + noOfchild * 123.33;
  };

  /**
   * @function showSubConditionBtn To check whether to show add sub condition button.
   * @returns {boolean} return condition.
   */
  const showSubConditionBtn = () => {
    if (selectedCategory && selectedCategory.children.length !== 0 && formValues?.criteria[index]?.values) {
      const { values } = formValues.criteria[index];
      const childArray = selectedCategory.children;

      const childCondition = criteriaConfigs.filter(
        (item) => childArray.includes(item.id) && values.includes(item.parentValue),
      );

      let flag = false;
      formValues.criteria.forEach((item) => {
        if (item.parentId && (!item.conditionId || !item.operator || item.values.length === 0)) {
          flag = true;
        }
      });
      if (flag) {
        return false;
      }
      if (!childCondition.filter((item) => !allSelectedCondition.includes(item.id)).length) {
        return false;
      }
      return true;
    }
    return false;
  };

  /**
   * @function showAddConditionBtn To check whether to show add sub condition button.
   * @returns {boolean} return condition.
   */
  const showAddIconBtn = () => {
    let lastCond = {};
    formValues.criteria.forEach((item) => {
      if (!item.parentId) {
        lastCond = item;
      }
    });
    if (lastCond?.id === id) {
      return showAddConditionBtn();
    }
    return false;
  };

  return (
    <>
      <Grid
        item
        container
        direction="row"
        alignItems="flex-start"
        justify="flex-start"
        md={create ? 9 : 10}
        className={childIndex % 2 === 0 ? classes.criteriaRow : classes.childCriteriaRow}
        data-testid="criteriaCondition"
      >
        <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
          <DropDownText
            source={`criteria[${index}].conditionId`}
            label={translate("promotion_condition")}
            variant="standard"
            edit={edit}
            value={conditionOptions?.find((item) => item.id === formValues?.criteria[index]?.conditionId)?.name}
            data={conditionOptions
              .filter(
                (data) =>
                  !allSelectedCondition.includes(data.id) || data.id === formValues?.criteria[index]?.conditionId,
              )
              .sort((a, b) => a.name.localeCompare(b.name))}
            onSelect={(e) => updateConditionData(e, { fieldName: "conditionId", id })}
          />
        </Grid>

        {selectedCategory?.conditionName && (
          <Grid item md={create ? 3 : 4} className={classes.maxWidthWrap}>
            <DropDownText
              source={`criteria[${index}].operator`}
              label={translate("promotion_operator")}
              variant="standard"
              edit={edit}
              value={formValues?.criteria[index]?.operator}
              data={operatorOptions}
              onSelect={(e) => {
                setSelectedOperator(null);
                setOperatorFlag(false);
                updateConditionData(e, { fieldName: "operator", id });
              }}
            />
          </Grid>
        )}

        {selectedCategory?.conditionName && operator && selectedOperator && operatorFlag && getMappedValues()}

        {edit && (
          <Grid
            item
            md={1}
            direction="row"
            className={create ? classes.createCriteriaBtns : classes.updateCriteriaBtns}
          >
            <IconButton onClick={() => deleteCondition(index)}>
              <DeleteOutlinedIcon />
            </IconButton>
            {showAddIconBtn() && (
              <IconButton className={classes.criteriaAddBtn} onClick={() => addConditionData()}>
                <AddBoxOutlinedIcon />
              </IconButton>
            )}
          </Grid>
        )}

        {edit && showSubConditionBtn() && (
          <Grid item className={classes.subCdnBtnWrapper} style={{ top: `${getPosition()}px` }}>
            <Button
              size="large"
              className={classes.subCdnBtn}
              onClick={() => {
                updateSubCondition({
                  childIndex: childIndex + 1,
                  parentId: conditionId,
                  index: index + subConditionCount,
                  subConditionCount: subConditionCount + 1,
                });
              }}
            >
              {translate("+ Add Sub Condition")}
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};

CriteriaCondition.propTypes = {
  edit: PropTypes.bool,
  create: PropTypes.bool,
  formValues: PropTypes.objectOf(PropTypes.any).isRequired,
  updateConditionData: PropTypes.func.isRequired,
  deleteCondition: PropTypes.func.isRequired,
  allSelectedCondition: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  criteriaConfigs: PropTypes.arrayOf(PropTypes.any).isRequired,
  conditionId: PropTypes.string.isRequired,
  operator: PropTypes.string.isRequired,
  updateSubCondition: PropTypes.func.isRequired,
  childIndex: PropTypes.number.isRequired,
  subConditionCount: PropTypes.number.isRequired,
  showAddConditionBtn: PropTypes.func.isRequired,
  addConditionData: PropTypes.func.isRequired,
  parentId: PropTypes.string,
};

CriteriaCondition.defaultProps = {
  edit: true,
  create: true,
  allSelectedCondition: [],
  parentId: "",
};

export default CriteriaCondition;
