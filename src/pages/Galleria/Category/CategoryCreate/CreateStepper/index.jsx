/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useCallback } from "react";
import { useRedirect, useTranslate, useNotify, useCreate } from "react-admin";
import { useDispatch } from "react-redux";
import { Typography, Grid, Chip } from "@material-ui/core";
import StepperCmp from "../../../../../components/Stepper";
import { setUrlValue } from "../../../../../actions/galleria";
import CategoryBasic from "../CategoryBasicDetails";
import CategoryMicroPLP from "../CategoryMicroPLP";
import CategorySEOConfig from "../CategorySeoConfig";
import CategoryPageContent from "../CategoryPageContent";
import CategoryProduct from "../CategoryProductAssociation";
import { getFormattedTimeValue, fetchDateString } from "../../../../../utils/formatDateTime";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

/**
 * Component for Create stepper
 *
 * @returns {React.ReactElement} returns a create stepper component
 */
const CreateStepper = () => {
  const translate = useTranslate();
  const redirect = useRedirect();
  const dispatch = useDispatch();
  const notify = useNotify();
  const [Caturl, setCatUrl] = useState("");
  const [responseData, setResponseData] = useState({});
  const [disableFlag, setDisableFlag] = useState(false);
  const [microplpData, setMicroplpData] = useState(false);
  const [taxonomyData, setTaxonomyData] = useState(false);
  const [isDomain, setDomainCheck] = useState(false);
  const [productType, setProductType] = useState(false);
  const [getDate, setGetDate] = useState(false);
  const [categoryClassification, setCategoryClassification] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const { taxonomy } = responseData;
  const { categoryName } = responseData;
  const { categoryType } = responseData;

  const breadcrumbs = [
    {
      displayName: translate("category_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    },
    { displayName: translate("new_category") },
  ];

  /**
   * @function getUrl
   * @param {event} event category value
   */
  const getUrl = useCallback((event) => {
    setCatUrl(event);
  }, []);
  /**
   * @function getVal
   * @param {event} event inherit value
   */
  const getVal = useCallback(
    (event) => {
      responseData.inheritSequencingAndProductFromBase = event;
      setResponseData(responseData);
    },
    [responseData],
  );
  /**
   * @function getmicroPlp
   * @param {event} event inherit value
   */
  const getmicroPlp = useCallback(
    (event) => {
      responseData.templateType = event.val;
      setResponseData(responseData);
      if (responseData.templateType) setMicroplpData(true);
    },
    [responseData],
  );
  /**
   * @function getData
   * @param {event} event response data
   */
  const getData = useCallback(
    (event) => {
      setResponseData(event);
      if (responseData.taxonomy?.geography?.tagId && responseData.taxonomy.geography.tagId !== null) {
        setTaxonomyData(true);
      } else {
        setTaxonomyData(false);
      }
      if (responseData.taxonomy?.domain?.tagId && responseData.taxonomy.domain.tagId !== null) {
        setDomainCheck(true);
      } else {
        setDomainCheck(false);
      }
      if (responseData.taxonomy?.productType?.tagId && responseData.taxonomy.productType.tagId !== null) {
        setProductType(true);
      } else {
        setProductType(false);
      }
      if (responseData.categoryClassification === "url") {
        setCategoryClassification(true);
      } else {
        setCategoryClassification(false);
      }
      if (
        responseData.fromDate &&
        responseData.thruDate &&
        new Date(responseData.fromDate) > new Date(responseData.thruDate)
      ) {
        setGetDate(true);
      } else {
        setGetDate(false);
      }
    },
    [responseData],
  );
  /**
   * @function getCanonicalVals
   * @param {event} event response data
   */
  const getCanonicalVals = useCallback(
    (event) => {
      if (event) {
        responseData.canonical = {};
        responseData.canonical.type = event.type;
        responseData.canonical.url = event.url;
        setResponseData(responseData);
      }
    },
    [responseData],
  );
  /**
   * @function convertToDateTimeFormat function returns the date in YYYY-MM-DD format as expected by react-admin date input
   * @param {*} date record from date value that needs to be formatted
   * @returns {string} returns formatted date
   */
  const convertToDateTimeFormat = useCallback((date) => {
    if (date) {
      const formattedDate = fetchDateString(date);
      const formattedTime = `T${getFormattedTimeValue()}`;
      return formattedDate.concat(formattedTime);
    }
    return date;
  }, []);
  /**
   * @function handleNextStepCount
   * @param {event} event step count
   */
  const handleNextStepCount = useCallback((event) => {
    setStepCount(event + 1);
  }, []);
  /**
   * @function handlePrevStepCount
   * @param {event} event step count
   */
  const handlePrevStepCount = useCallback((event) => {
    setStepCount(event - 1);
  }, []);

  useEffect(() => {
    switch (stepCount) {
      case 0:
        if (
          responseData.categoryClassification === undefined ||
          categoryName === undefined ||
          categoryName.value === "" ||
          categoryType === undefined ||
          getDate ||
          (isDomain === false && taxonomy?.domain?.tagId) === undefined ||
          taxonomy?.domain?.tagId === null ||
          (taxonomyData === false && taxonomy?.geography?.tagId) === undefined ||
          taxonomy?.geography?.tagId === null ||
          (((productType === false && taxonomy?.productType?.tagId) === undefined ||
            taxonomy?.productType?.tagId === null) &&
            categoryClassification)
        ) {
          setDisableFlag(true);
        } else setDisableFlag(false);
        break;
      case 1:
        if (microplpData === false && responseData.templateType === "") {
          setDisableFlag(true);
        } else {
          setDisableFlag(false);
        }
        break;
      default:
        setDisableFlag(false);
    }
  }, [
    categoryName,
    categoryType,
    responseData,
    taxonomy,
    stepCount,
    microplpData,
    taxonomyData,
    isDomain,
    productType,
    categoryClassification,
    getDate,
  ]);
  useEffect(() => {
    return () => {
      dispatch(setUrlValue({ id: "" }));
    };
  }, [dispatch]);
  const LabelArr = [
    <Chip label={translate("basic_details")} href="#chip" variant="outlined" />,
    <Chip label={translate("micro_plp")} href="#chip" variant="outlined" />,
    <Chip label={translate("seo_config")} href="#chip" variant="outlined" />,
    <Chip label={translate("product_cont")} href="#chip" variant="outlined" />,
    <Chip label={translate("product_asso")} href="#chip" variant="outlined" />,
  ];
  const StepsArr = [
    <CategoryBasic categoryUrlVal={getUrl} ResponseData={getData} updatedResponse={responseData} />,
    <CategoryMicroPLP templateType={responseData.templateType} micro_plpChangedVal={getmicroPlp} />,
    <CategorySEOConfig
      categoryUrl={Caturl}
      canonicalData={responseData.canonical}
      selectedCanTypeUrl={getCanonicalVals}
    />,
    <CategoryPageContent />,
    <CategoryProduct inheritVal={responseData.inheritSequencingAndProductFromBase} inheritChangedVal={getVal} />,
  ];

  const [handleCreate] = useCreate(
    `${window.REACT_APP_GALLERIA_SERVICE}/categories`,
    {
      dataObj: JSON.stringify({
        categoryConfigurationRequest: {
          inheritSequencingAndProductFromBase: responseData.inheritSequencingAndProductFromBase || false,
          templateType: responseData.templateType,
        },
        categoryRequest: {
          baseCategory: responseData.id,
          categoryClassification: responseData.categoryClassification,
          categoryName: categoryName ? categoryName.value : null,
          categoryType: categoryType && categoryType.value ? categoryType.value.id : null,
          categoryUrl: responseData.categoryUrl,
          city: taxonomy && taxonomy.city ? taxonomy.city.tagId : null,
          domain: taxonomy && taxonomy.domain ? taxonomy.domain.tagId : null,
          fromDate: responseData.fromDate ? convertToDateTimeFormat(responseData.fromDate) : null,
          geography: taxonomy && taxonomy.geography ? taxonomy.geography.tagId : null,
          occasion: taxonomy && taxonomy.occasion ? taxonomy.occasion.tagId : null,
          party: taxonomy && taxonomy.party ? taxonomy.party.tagId : null,
          productType: taxonomy && taxonomy.productType ? taxonomy.productType.tagId : null,
          recipient: taxonomy && taxonomy.recipient ? taxonomy.recipient.tagId : null,
          thruDate: responseData.thruDate ? convertToDateTimeFormat(responseData.thruDate) : null,
        },
        categorySeoRequest: {
          canonical: {
            type: responseData.canonical ? responseData.canonical.type : "",
            url: responseData.canonical ? responseData.canonical.url : "",
          },
        },
      }),
    },
    {
      onSuccess: (res) => {
        if (res.status === "success") {
          redirect(`/${window.REACT_APP_GALLERIA_SERVICE}/categories`);
          notify(res.data.message || translate("create_category_success_message"));
        } else {
          notify(res.message || translate("create_category_error_message"));
        }
      },
      onFailure: (error) => notify(`Error: ${error.message}`, "error", TIMEOUT),
    },
  );
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid item>
        <Typography variant="subtitle1">{translate("new_category")}</Typography>
      </Grid>
      <StepperCmp
        StepsArray={StepsArr}
        LabelsArray={LabelArr}
        prev={translate("prev")}
        next={translate("next")}
        create={translate("create")}
        createData={handleCreate}
        isDisable={disableFlag}
        handleNextSteps={handleNextStepCount}
        handlePrevSteps={handlePrevStepCount}
      />
    </>
  );
};
export default React.memo(CreateStepper);
