import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import PricingCRONConfigurations from "../index";

describe("Pricing CRON Configurations Details", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<PricingCRONConfigurations />);
    result = renderer1.getRenderOutput();
  });

  test("Configuration form container exists", () => {
    const container = result.props.children.props["data-test-id"];
    expect(container).toEqual("form-container");
  });

  afterEach(() => {
    cleanup();
  });
});
