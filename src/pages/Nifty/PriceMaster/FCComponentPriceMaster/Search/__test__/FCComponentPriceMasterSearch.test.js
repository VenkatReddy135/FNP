import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import FCComponentPriceMasterSearch from "../index";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useTranslate: () => (label) => label,
  required: () => true,
  FormWithRedirect: jest.fn(),
  DateInput: jest.fn(),
  SelectInput: jest.fn(),
  FormDataConsumer: jest.fn(),
  NumberInput: jest.fn(),
}));

describe("FC-Component Price Master Search", () => {
  let result;
  let form;
  let firstRow;
  let secondRow;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<FCComponentPriceMasterSearch />);
    result = renderer1.getRenderOutput();
    const handleSubmitWithRedirect = jest.fn();
    const rest = {
      form: {},
    };
    const formRenderer = result.props.children[3].props.render;
    form = formRenderer({ handleSubmitWithRedirect, ...rest });
    const formDataConsumer = form.props.children[0].props.children({ formData: {} });
    firstRow = formDataConsumer.props.children[0].props;
    secondRow = formDataConsumer.props.children[1].props;
  });

  test("Search page breadcrumb should exists", () => {
    expect(result.props.children[0].type.propTypes.breadcrumbs).toBeTruthy();
  });

  test("Search form should exists", () => {
    expect(form).toBeTruthy();
  });

  test("Search form FC Group Name operator field exists", () => {
    expect(firstRow.children[0].props.children.props.testId).toEqual("fcGroupNameOperator");
  });

  test("Search form FC Group Name field exists", () => {
    expect(firstRow.children[1].props.children.props.source).toEqual("fcGroupName");
  });

  test("Search form Fulfillment Geo operator field exists", () => {
    expect(firstRow.children[2].props.children.props.testId).toEqual("fulfillmentGeoOperator");
  });

  test("Search form Fulfillment Geo field exists", () => {
    expect(firstRow.children[3].props.children.props.source).toEqual("fulfillmentGeo");
  });

  test("Search form Component Name operator field exists", () => {
    expect(firstRow.children[4].props.children.props.testId).toEqual("componentNameOperator");
  });

  test("Search form Component Name field exists", () => {
    expect(firstRow.children[5].props.children.props.source).toEqual("componentName");
  });

  test("Search form Price Operator field exists", () => {
    expect(secondRow.children[0].props.children.props["data-test-id"]).toEqual("priceOperator");
  });

  test("Search form Price field exists", () => {
    expect(secondRow.children[1].props.children.props["data-test-id"]).toEqual("price");
  });

  test("Search form From Date Operator field exists", () => {
    expect(secondRow.children[2].props.children.props["data-test-id"]).toEqual("fromDateOperator");
  });

  test("Search form From Date field exists", () => {
    expect(secondRow.children[3].props.children.props["data-test-id"]).toEqual("fromDate");
  });

  test("Search form To Date Operator field exists", () => {
    expect(secondRow.children[4].props.children.props["data-test-id"]).toEqual("toDateOperator");
  });

  test("Search form To Date field exists", () => {
    expect(secondRow.children[5].props.children.props["data-test-id"]).toEqual("toDate");
  });

  afterEach(() => {
    cleanup();
  });
});
