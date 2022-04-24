/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import PropertiesForm from "../index";
import { NIFTY_PAGE_TYPE } from "../../../../niftyConfig";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  required: () => true,
  BooleanInput: jest.fn(),
  TextInput: jest.fn(),
  DateInput: jest.fn(),
  useCallback: jest.fn(),
  FormWithRedirect: jest.fn(),
  regex: jest.fn(),
  minValue: jest.fn(),
}));
const initialState = {
  pricingRuleName: "",
  pricingRuleDescription: "",
  fromDate: "",
  toDate: "",
  isEnabled: true,
};
const rest = {
  form: {
    getState: {},
  },
};
describe("Price Rule Management Properties Form", () => {
  let result;
  let form;
  let firstRowFirstColumn;
  let firstRowSecondColumn;
  let secondRowFirstColumn;
  let secondRowSecondColumn;
  const savePriceRuleManagementProperties = jest.fn();

  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<PropertiesForm mode={NIFTY_PAGE_TYPE.CREATE} initialState={initialState} />);
    result = renderer1.getRenderOutput();
    const formRenderer = result.props.children.props.render;
    form = formRenderer({ savePriceRuleManagementProperties, ...rest });
    firstRowFirstColumn = form.props.children.props.children[0].props.children[0].props.children.props.source;
    firstRowSecondColumn = form.props.children.props.children[0].props.children[1].props.children.props.source;
    secondRowFirstColumn = form.props.children.props.children[1].props.children[0].props.children.props.source;
    secondRowSecondColumn = form.props.children.props.children[1].props.children[1].props.children.props.source;
  });

  test("PriceRuleManagement Properties component should exist", () => {
    expect(result).toBeTruthy();
  });

  it("should include form first row first column label to be pricingRuleName", () => {
    expect(firstRowFirstColumn).toBe("pricingRuleName");
  });
  it("should include form first row second column label to be pricingRuleDescription", () => {
    expect(firstRowSecondColumn).toBe("pricingRuleDescription");
  });
  it("should include form first row second column label to be fromDate", () => {
    expect(secondRowFirstColumn).toBe("fromDate");
  });
  it("should include form first row second column label to be toDate", () => {
    expect(secondRowSecondColumn).toBe("toDate");
  });

  afterEach(() => {
    cleanup();
  });
});
