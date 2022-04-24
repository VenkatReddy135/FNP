import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import MultiTieredConfiguration from "../index";
import { INITIAL_SHIPPING_CONFIG } from "../../../niftyConfig";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  required: () => true,
  ArrayInput: jest.fn(),
  SimpleFormIterator: jest.fn(),
  FormDataConsumer: jest.fn(),
  SelectInput: jest.fn(),
  BooleanInput: jest.fn(),
  NumberInput: jest.fn(),
}));

const mockState = {
  metric: "",
  configList: [{ ...INITIAL_SHIPPING_CONFIG }],
};

describe("Multi Tiered Configuration details", () => {
  let result;
  let rowDetails;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    const onAddConfig = jest.fn();
    const onDeleteConfig = jest.fn();
    const getSource = jest.fn();
    const form = {
      getState: () => {
        return {
          values: { ...mockState },
        };
      },
    };
    renderer1.render(
      <MultiTieredConfiguration
        sourceName="configList"
        addConfig={onAddConfig}
        deleteConfig={onDeleteConfig}
        formRef={form}
      />,
    );
    result = renderer1.getRenderOutput();
    rowDetails = result.props.children[1].props.children[0].props.children.props.children.props.children.props.children(
      { getSource },
    );
  });

  test("configuration form exists", () => {
    expect(result).toBeTruthy();
  });

  test("configuration metric field exists", () => {
    const field = result.props.children[0].props.children.props.children.props["data-test-id"];
    expect(field).toEqual("metric");
  });

  test("configuration from operator field exists", () => {
    expect(rowDetails.props.children[0].props.children.props["data-test-id"]).toEqual("fromOperator");
  });

  test("configuration from range field exists", () => {
    expect(rowDetails.props.children[1].props.children.props["data-test-id"]).toEqual("fromRange");
  });

  test("configuration to operator field exists", () => {
    expect(rowDetails.props.children[2].props.children.props["data-test-id"]).toEqual("toOperator");
  });

  test("configuration to range field exists", () => {
    expect(rowDetails.props.children[3].props.children.props["data-test-id"]).toEqual("toRange");
  });

  test("configuration rate field exists", () => {
    expect(rowDetails.props.children[4].props.children.props["data-test-id"]).toEqual("rate");
  });

  test("configuration status field exists", () => {
    expect(rowDetails.props.children[5].props.children.props["data-test-id"]).toEqual("status");
  });

  afterEach(() => {
    cleanup();
  });
});
