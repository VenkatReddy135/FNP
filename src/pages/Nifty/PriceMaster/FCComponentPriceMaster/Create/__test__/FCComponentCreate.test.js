import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import FCComponentPriceMasterCreate from "../index";
import { NIFTY_PAGE_TYPE } from "../../../../niftyConfig";

describe("FC-Component Price Master Create", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<FCComponentPriceMasterCreate />);
    result = renderer1.getRenderOutput();
  });

  test("Create form container exists", () => {
    expect(result).toBeTruthy();
  });

  it("should have create as mode", () => {
    expect(result.props.mode).toEqual(NIFTY_PAGE_TYPE.CREATE);
  });

  afterEach(() => {
    cleanup();
  });
});
