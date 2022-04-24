import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import PriceRuleManagementDetails from "../index";

describe("Price Rule Management Details", () => {
  let result;
  let priceRuleStepper;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<PriceRuleManagementDetails />);
    result = renderer1.getRenderOutput();
    priceRuleStepper = result.props.children[3].props;
  });

  test("Price rule tabs should exists", () => {
    expect(result.props.children[3]).toBeTruthy();
  });

  test("Price rule breadcrumb should exists", () => {
    expect(result.props.children[0]).toBeTruthy();
  });

  test("Price rule Properties tab should render", () => {
    expect(priceRuleStepper.StepsArray[0]).toBeTruthy();
  });

  test("Price rule Properties tab label should be valid", () => {
    expect(priceRuleStepper.LabelsArray[0].props.label).toEqual("priceRuleManagement.properties");
  });

  test("Price rule Action tab should render", () => {
    expect(priceRuleStepper.StepsArray[1]).toBeTruthy();
  });

  test("Price rule Action tab label should be valid", () => {
    expect(priceRuleStepper.LabelsArray[1].props.label).toEqual("priceRuleManagement.action");
  });

  afterEach(() => {
    cleanup();
  });
});
