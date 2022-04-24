/**
 * @jest-environment jsdom
 */
import React from "react";

import SimpleGrid from "../../../../../components/SimpleGrid";
import { cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import OccasionList from "..";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useTranslate: () => (label) => label,
  useMutation: () => [() => {}],
  useRefresh: () => [() => {}],
  List: () => <></>,
  ResourceContextProvider: () => <></>,
  Component: () => <></>,
}));

describe("Occasion List test cases", () => {
  const initialState = {
    occasionData: {
      selectionOccasion: {
        occasionId: "100th-birthday",
        occasionName: "100th Birthday",
      },
    },
  };

  const mockStore = configureStore();
  const store = mockStore(initialState);
  let component, testInstance;

  beforeEach(() => {
    component = renderer.create(
      <Provider store={store}>
        <OccasionList />
      </Provider>,
    );
    testInstance = component.root;
  });
  afterEach(() => {
    cleanup();
  });
  it("should render OccasionList component", () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
  it("should contain grid title", () => {
    expect(testInstance.findByType(SimpleGrid).props.gridTitle).toBe("free_message_config");
  });
  it("should contain search label", () => {
    expect(testInstance.findByType(SimpleGrid).props.searchLabel).toBe("search");
  });
  it("should not have any buttons on filled grid", () => {
    expect(testInstance.findByType(SimpleGrid).props.actionButtonsForGrid).toEqual([]);
  });
  it("should have smaller search field", () => {
    expect(testInstance.findByType(SimpleGrid).props.isSmallerSearch).toEqual(true);
  });
  it("should sort based on occasion name column by default", () => {
    expect(testInstance.findByType(SimpleGrid).props.sortField.field).toBe("occasionName");
  });
  it("should contain 7 columns", () => {
    expect(testInstance.findByType(SimpleGrid).props.configurationForGrid.length).toEqual(7);
  });
  it("should have first column header as Occasion", () => {
    expect(testInstance.findByType(SimpleGrid).props.configurationForGrid[0].label).toBe("category_occ");
  });
  it("should have second column header as Status", () => {
    expect(testInstance.findByType(SimpleGrid).props.configurationForGrid[1].label).toBe("status");
  });
  it("should have third column header as Messages", () => {
    expect(testInstance.findByType(SimpleGrid).props.configurationForGrid[2].label).toBe("messages");
  });
  it("should have link as values for Messages column", () => {
    expect(testInstance.findByType(SimpleGrid).props.configurationForGrid[2].isAnchorLink).toBe(true);
  });
});
