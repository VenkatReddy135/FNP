import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import FCComponentPriceMasterEdit from "../index";

describe("FC-Component Price Master Edit", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<FCComponentPriceMasterEdit />);
    result = renderer1.getRenderOutput();
  });

  test("Edit form container exists", () => {
    expect(result).toBeTruthy();
  });

  afterEach(() => {
    cleanup();
  });
});
