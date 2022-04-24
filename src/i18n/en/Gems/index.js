import product from "./Product/product";
import productComposition from "./Product/product_composition";
import productFeatures from "./Product/product_features";
import productAttributes from "./Product/product_attributes";
import productPersonalization from "./Product/product_personalization";

export default {
  ...product,
  ...productComposition,
  ...productFeatures,
  ...productAttributes,
  ...productPersonalization,
};
