import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import ComponentPriceRuleManagerView from "../index";
import { NIFTY_PAGE_TYPE } from "../../../../niftyConfig";

describe("Component Price Rule Manager View", () => {
  let result;
  let resultProps;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<ComponentPriceRuleManagerView />);
    result = renderer1.getRenderOutput();
    resultProps = result.props;
  });

  it("should render Component Price Rule Manager View UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should have page title", () => {
    expect(resultProps.pageTitle).toBeDefined();
  });

  it("should have mode as view", () => {
    expect(resultProps.mode).toEqual(NIFTY_PAGE_TYPE.VIEW);
  });

  afterEach(() => {
    cleanup();
  });
});
