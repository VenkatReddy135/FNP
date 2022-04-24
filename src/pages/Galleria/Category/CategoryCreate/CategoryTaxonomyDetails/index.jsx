/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useCallback } from "react";
import { useQueryWithStore, useNotify, useTranslate, useMutation } from "react-admin";
import PropTypes from "prop-types";
import CategoryTaxonomyUI from "./CategoryTaxonomyUI";
import { TIMEOUT } from "../../../../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../../../../utils/CustomHooks/HelperFunctions";

/**
 * Component for taxonomy details.
 *
 * @param {*} props props for category create Taxonomy
 * @returns {React.ReactElement} returns a Category taxonomy details component
 */
const TaxonomyDetails = (props) => {
  const notify = useNotify();
  const translate = useTranslate();
  const [mutate] = useMutation();
  const { taxonomyObj } = props;
  const [party, setParty] = useState([]);
  const [city, setCity] = useState([]);
  const [domain, setDomain] = useState([]);
  const [recipient, setRecipient] = useState([]);
  const [geo, setGeo] = useState([]);
  const [product, setProduct] = useState([]);
  const [occassion, setOccassion] = useState([]);
  const [taxonomyVal, setTaxonomyVal] = useState({});
  const [domainGeoValues, setDomainGeoValues] = useState({});
  const [errorMessageDomain, setErrorMessageDomain] = useState(false);
  const [errorMessageGeo, setErrorMessageGeo] = useState(false);
  const [errorMessageProduct, setErrorMessageProduct] = useState(false);
  const [taxonomyFlag, setTaxonomyFlag] = useState(false);
  let domainVal = null;
  let geoVal = null;
  let cityVal = null;
  if (taxonomyFlag && taxonomyObj?.taxonomy?.domain) {
    domainVal = taxonomyObj.taxonomy.domain.tagId;
  }
  if (taxonomyFlag && taxonomyObj?.taxonomy?.geography) {
    geoVal = taxonomyObj.taxonomy.geography.tagId;
  }
  if (taxonomyFlag && taxonomyObj?.taxonomy?.city) {
    cityVal = taxonomyObj.taxonomy.city.tagId;
  }
  const [taxonomyFilter, setFilter] = useState(
    encodeURIComponent(
      JSON.stringify([
        {
          fieldName: "tagTypeId",
          operatorName: "Like",
          fieldValue: "G",
        },
      ]),
    ),
  );
  const [taxonomyValue, setTaxonomyValue] = useState("G");
  /**
   * @function handleSuccess This function will handle success of the api call
   * @param {object} res is passed to the function
   */
  const handleSuccess = (res) => {
    const partyValue = [];
    if (res?.data?.data) {
      res.data.data.forEach((data) => {
        partyValue.push({ tagId: data.id, tagName: data.name });
      });
    }
    setParty(partyValue);
  };

  /**
   * @param {number} idval id value
   * @param {string} idName id name
   * @function transformCategoryUrlVal
   */
  const transformCategoryUrlVal = useCallback(
    (idval, idName) => {
      setTaxonomyVal((prevData) => ({ ...prevData, [idval]: idName }));
      let modifiedUrl = "";
      let domainGeoCheck = "";
      if (idval && idval === "D") {
        modifiedUrl = idName;
        domainGeoCheck = domainGeoValues[idName];
      } else if (taxonomyVal.D) {
        modifiedUrl = taxonomyVal.D;
        const currentDomain = domain.find((domKeyVal) => domKeyVal.tagId === taxonomyVal.D);
        if (currentDomain) domainGeoCheck = domainGeoValues[currentDomain.tagId];
      }
      if (idval && idval === "G") {
        let geography = "";
        if (idName) geography = `/${idName}`;
        if (domainGeoCheck) {
          if (domainGeoCheck.toLowerCase() !== idName.toLowerCase()) {
            modifiedUrl = `${modifiedUrl}${geography}`;
          }
        } else {
          modifiedUrl = `${modifiedUrl}${geography}`;
        }
      } else if (taxonomyVal.G) {
        if (domainGeoCheck) {
          const currentGeo = geo.find((geoKeyVal) => geoKeyVal?.tagId === taxonomyVal.G);
          if (domainGeoCheck.toLowerCase() !== currentGeo?.tagId.toLowerCase())
            modifiedUrl = `${modifiedUrl}${`/${taxonomyVal.G}`}`;
        } else {
          modifiedUrl = `${modifiedUrl}${`/${taxonomyVal.G}`}`;
        }
      }
      if ((idval && idval === "P") || taxonomyVal.P) {
        let partyVal = "";
        if (idName) partyVal = `/${idName}`;
        modifiedUrl = `${modifiedUrl}${idval && idval === "P" ? partyVal : `/${taxonomyVal.P}`}`;
      }
      if ((idval && idval === "PT") || taxonomyVal.PT) {
        let productType = "";
        if (idName) productType = `/${idName}`;
        modifiedUrl = `${modifiedUrl}${idval && idval === "PT" ? productType : `/${taxonomyVal.PT}`}`;
      }
      if ((idval && idval === "O") || taxonomyVal.O) {
        let occasion = "";
        if (idName) occasion = `/${idName}`;
        modifiedUrl = `${modifiedUrl}${idval && idval === "O" ? occasion : `/${taxonomyVal.O}`}`;
      }
      if ((idval && idval === "C") || taxonomyVal.C) {
        let cityTaxonomy = "";
        if (idName) cityTaxonomy = `/${idName}`;
        modifiedUrl = `${modifiedUrl}${idval && idval === "C" ? cityTaxonomy : `/${taxonomyVal.C}`}`;
      }
      if ((idval && idval === "R") || taxonomyVal.R) {
        let recipients = "";
        if (idName) recipients = `/${idName}`;
        modifiedUrl = `${modifiedUrl}${idval && idval === "R" ? recipients : `/${taxonomyVal.R}`}`;
      }

      taxonomyObj.categoryUrl = modifiedUrl.toLowerCase();
      props.catUrl(modifiedUrl);
    },
    [domain, geo, taxonomyVal, props, domainGeoValues, taxonomyObj],
  );

  /**
   * @function updateTaxonomy function that updates the changed value of selected taxonomy dropdown
   * @param {*} event event object
   * @param {string} newValue new selected value
   * @param {string} idval value of id selected
   * @param {string} objKey name of the key
   */
  const updateTaxonomy = useCallback(
    (event, newValue, idval, objKey) => {
      const valueObj = newValue || null;
      if (idval === "D" && (geoVal || cityVal)) {
        taxonomyObj.taxonomy.geography = {};
        taxonomyObj.taxonomy.city = {};
      }
      if (idval === "G" && cityVal) {
        taxonomyObj.taxonomy.city = {};
      }
      if (!taxonomyObj.taxonomy) taxonomyObj.taxonomy = {};
      if (!taxonomyObj.taxonomy[`${objKey}`]) {
        taxonomyObj.taxonomy[`${objKey}`] = {};
      }
      taxonomyObj.taxonomy[`${objKey}`].tagId = valueObj ? valueObj.tagId : null;
      taxonomyObj.taxonomy[`${objKey}`].tagName = valueObj ? valueObj.tagName : null;
      setTaxonomyFlag(true);
      props.updatedTaxonomy(taxonomyObj);
      transformCategoryUrlVal(idval, newValue ? newValue.tagId.toLowerCase() : "");
    },
    [props, taxonomyObj, transformCategoryUrlVal, geoVal, cityVal],
  );

  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/tags`,
      payload: {
        filter: taxonomyFilter,
        size: 100,
        sortParam: "tagName:asc",
      },
    },
    {
      onSuccess: (res) => {
        const response = res.data.data;
        if (response) {
          if (taxonomyValue === "D") {
            const taxonomyDomain = response || [];
            setDomain(taxonomyDomain);
          } else if (taxonomyValue === "C") {
            const taxonomyCity = response || [];
            setCity(taxonomyCity);
          } else if (taxonomyValue === "R") {
            const taxonomyRecipient = response || [];
            setRecipient(taxonomyRecipient);
          } else if (taxonomyValue === "PT") {
            const taxonomyProduct = response || [];
            setProduct(taxonomyProduct);
          } else if (taxonomyValue === "O") {
            const taxonomyOccassion = response || [];
            setOccassion(taxonomyOccassion);
          } else if (taxonomyValue === "G") {
            const taxonomyGeo = response || [];
            setGeo(taxonomyGeo);
          }
        } else if (
          (response && response.errors && response.errors[0] && response.errors[0].message, "error", TIMEOUT)
        ) {
          notify(response.errors[0].message, "error", TIMEOUT);
        }
      },
      onFailure: (error) => notify(`Error: ${error.message}`, "error", TIMEOUT),
    },
  );
  useQueryWithStore(
    {
      type: "getData",
      resource: `${window.REACT_APP_GALLERIA_SERVICE}/categories/primary-domain-geo`,
      payload: {},
    },
    {
      onSuccess: (res) => {
        const response = res?.data?.data;
        if (response) {
          response.forEach((data) => {
            setDomainGeoValues((prevData) => ({
              ...prevData,
              [data.domainId.toLowerCase()]: data.geographyId.toLowerCase(),
            }));
          });
        } else if (
          (response && response.errors && response.errors[0] && response.errors[0].message, "error", TIMEOUT)
        ) {
          notify(response.errors[0].message, "error", TIMEOUT);
        }
      },
      onFailure: (error) => notify(`Error: ${error.message}`, "error", TIMEOUT),
    },
  );
  useEffect(() => {
    const { taxonomy } = taxonomyObj;
    let initialTaxonomyVal = {};
    if (taxonomy) {
      initialTaxonomyVal = {
        D: taxonomy.domain ? taxonomy.domain.tagId : "",
        G: taxonomy.geography ? taxonomy.geography.tagId : "",
        P: taxonomy.party ? taxonomy.party.tagId : "",
        PT: taxonomy.productType ? taxonomy.productType.tagId : "",
        O: taxonomy.occasion ? taxonomy.occasion.tagId : "",
        C: taxonomy.city ? taxonomy.city.tagId : "",
        R: taxonomy.recipient ? taxonomy.recipient.tagId : "",
      };
    }
    if (Object.keys(taxonomyObj).length > 0) {
      setTaxonomyFlag(true);
    }
    setFilter(
      encodeURIComponent(
        JSON.stringify([
          {
            fieldName: "tagTypeId",
            operatorName: "Like",
            fieldValue: "D",
          },
        ]),
      ),
    );
    setTaxonomyValue("D");
    setTaxonomyVal(initialTaxonomyVal);
  }, [taxonomyObj]);
  props.updatedTaxonomy(taxonomyObj);
  /**
   * @function handleInputChange function that updates the changed value of selected taxonomy dropdown
   * @param {string} newValue value key
   * @param {string} taxonomy value of id selected
   */
  const handleInputChange = (newValue, taxonomy) => {
    if (taxonomy === "P") {
      mutate(
        {
          type: "getData",
          resource: `${window.REACT_APP_PARTY_SERVICE}/publishers`,
          payload: { simpleSearchValue: newValue || null, page: "0", size: "10", sortParam: "modifiedDate:DESC" },
        },
        {
          onSuccess: (response) => onSuccess({ response, notify, translate, handleSuccess }),
          onFailure: (error) => onFailure({ error, notify, translate }),
        },
      );
    }
    let filter = [];
    if (taxonomy === "G" && domainVal) {
      filter = [
        { fieldName: "domain", operatorName: "EqualTo", fieldValue: domainVal },
        {
          fieldName: "tagTypeId",
          operatorName: "EqualTo",
          fieldValue: taxonomy,
        },
      ];
    } else if (taxonomy === "C" && geoVal) {
      filter = [
        { fieldName: "geography", operatorName: "EqualTo", fieldValue: geoVal },
        {
          fieldName: "tagTypeId",
          operatorName: "EqualTo",
          fieldValue: taxonomy,
        },
      ];
    } else {
      filter = [
        {
          fieldName: "tagTypeId",
          operatorName: "Like",
          fieldValue: taxonomy,
        },
      ];
    }

    if (newValue) {
      filter.push({
        fieldName: "tagName",
        operatorName: "Like",
        fieldValue: newValue,
      });
    }
    if (newValue === "" && taxonomy === "D") {
      setErrorMessageDomain(true);
    } else if (newValue === "" && taxonomy === "G") {
      setErrorMessageGeo(true);
    } else if (newValue && taxonomy === "G") {
      setErrorMessageGeo(false);
    } else if (newValue === "" && taxonomy === "PT") {
      setErrorMessageProduct(true);
    } else {
      setErrorMessageDomain(false);
      setErrorMessageProduct(false);
    }
    const encodedFilter = encodeURIComponent(JSON.stringify(filter));
    setFilter(encodedFilter);
    setTaxonomyValue(taxonomy);
  };

  return (
    <CategoryTaxonomyUI
      party={party}
      domain={domain}
      geo={geo}
      city={city}
      recipient={recipient}
      product={product}
      occassion={occassion}
      taxonomyFlag={taxonomyFlag}
      taxonomyObj={taxonomyObj}
      handleInputChange={handleInputChange}
      updateTaxonomy={updateTaxonomy}
      errorMsg={{ domain: errorMessageDomain, geo: errorMessageGeo, product: errorMessageProduct }}
    />
  );
};
TaxonomyDetails.propTypes = {
  catUrl: PropTypes.func,
  taxonomyObj: PropTypes.objectOf(PropTypes.any),
  updatedTaxonomy: PropTypes.func,
};
TaxonomyDetails.defaultProps = {
  catUrl: () => {},
  taxonomyObj: {},
  updatedTaxonomy: () => {},
};
export default TaxonomyDetails;
