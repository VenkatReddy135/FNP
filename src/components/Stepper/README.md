# Stepper

Stepper component renders react component which display progress through a sequence of logical and numbered steps.It renders a horizontal type stepper where contains of one step depend on earlier step.

## Props

Stepper needs the following props -

1. StepsArray :

- This contains numbered steps with active step info which you can add in the stepper. It will break it into multiple logical and numbered steps.
- It is an array type field
  e.g., const StepsArr = [
  <CategoryBasic categoryUrlVal={getUrl} ResponseData={getData} updatedResponse={responseData} />,
  <CategoryMicroPLP templateType={responseData.templateType} micro_plpChangedVal={getmicroPlp} />,
  <CategorySEOConfig
  categoryUrl={url}
  canonicalData={responseData.canonical}
  selectedCanTypeUrl={getCanonicalVals}
  />,
  <CategoryPageContent />,
  <CategoryProduct inheritVal={responseData.inheritSequencingAndProductFromBase} inheritChangedVal={getVal} />,
  ];

2. LabelsArray :

- This contains names you want to add to the steps.
- It is an array type field
  e.g., const LabelArr = [
  translate("basic_details"),
  translate("micro_plp"),
  translate("seo_config"),
  translate("product_cont"),
  translate("product_asso"),
  ];

3. createData :

- This handler is used to call the create category API
- It is a function type field
  e.g., const handleCreate= () =>{}

4. handleNextSteps :

- This contains the active step information and it is used as a handler for moving to next step
- It is a function type field
  e.g., const handleNextStepCount = (event) => {
  setCount(event + 1);
  };

5. handlePrevSteps :

- This contains the active step information and it is used as a handler for moving to previous step
- It is a function type field
  e.g., const handlePrevStepCount = (event) => {
  setCount(event - 1);
  };

6. prev :

- This is string value which contains label for the previous button
- e.g., prev: "",

7. next :

- This is string value which contains label for the next button
- e.g., next: "",

8. create :

- This is string value which contains label for the create button
- e.g., create: "",

9. isDisable :

- This is a boolean prop to disable the button for validation
- e.g., isDisable: false,
