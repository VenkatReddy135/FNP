import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import ComponentPriceRuleManagerCreate from "../index";
import { NIFTY_PAGE_TYPE } from "../../../../niftyConfig";

describe("Component Price Rule Manager Create", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<ComponentPriceRuleManagerCreate />);
    result = renderer1.getRenderOutput();
  });

  test("Component Price Rule Manager Create form exists", () => {
    expect(result).toBeTruthy();
  });

  it("should have create as mode", () => {
    expect(result.props.mode).toEqual(NIFTY_PAGE_TYPE.CREATE);
  });

  afterEach(() => {
    cleanup();
  });
});
