import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import FCComponentPriceMasterView from "../index";

describe("FC-Component Price Master View", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<FCComponentPriceMasterView />);
    result = renderer1.getRenderOutput();
  });

  test("View form container exists", () => {
    expect(result).toBeTruthy();
  });

  afterEach(() => {
    cleanup();
  });
});
