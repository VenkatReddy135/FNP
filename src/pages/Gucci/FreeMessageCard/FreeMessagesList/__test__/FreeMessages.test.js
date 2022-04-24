/**
 * @jest-environment jsdom
 */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { cleanup } from "@testing-library/react";
import { useTranslate } from "react-admin";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import FreeMessagesList from "../index";
import SimpleGrid from "../../../../../components/SimpleGrid";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useMutation: () => [() => {}],
  useTranslate: () => (label) => label,
  useRefresh: () => [() => {}],
  List: () => [() => {}],
  ResourceContextProvider: () => [() => {}],
}));

describe("Free message list test cases", () => {
  const match = {
    params: {
      id: "100th-birthday",
    },
  };
  const initialState = {
    messagecard: {
      occasionData: {
        selectedOccasion: {
          occasionId: "100th-birthday",
          occasionName: "100th Birthday",
        },
      },
    },
  };
  const mockStore = configureStore();
  const store = mockStore(initialState);
  const translate = useTranslate();
  let component;
  let testInstance;
  let simpleGridInstance;

  beforeEach(() => {
    component = renderer.create(
      <Provider store={store}>
        <FreeMessagesList />
      </Provider>,
    );
    testInstance = component.root;
    simpleGridInstance = testInstance.findByType(SimpleGrid);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render FreeMessagesList component", () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should contain search label place holder for search field", () => {
    expect(simpleGridInstance.props.searchLabel).toBe("search");
  });

  it("search field should be small", () => {
    expect(simpleGridInstance.props.isSmallerSearch).toBe(true);
  });

  it("should be grid title present", () => {
    expect(simpleGridInstance.props.gridTitle).toBe(
      initialState.messagecard.occasionData.selectedOccasion.occasionName,
    );
  });

  it("sort column should be text column", () => {
    expect(simpleGridInstance.props.sortField.field).toBe("text");
  });

  it("should have New Message button", () => {
    expect(simpleGridInstance.props.actionButtonsForGrid[0].label).toBe(translate("new_message"));
  });

  it("get listing based on id passed", () => {
    expect(simpleGridInstance.props.filter.occasionId).toBe(match.params.id);
  });

  it("grid should have six columns", () => {
    expect(simpleGridInstance.props.configurationForGrid.length).toEqual(6);
  });

  it("grid first column header should be Message on Card", () => {
    expect(simpleGridInstance.props.configurationForGrid[0].label).toBe(translate("message_on_card"));
  });

  it("grid second column header should be Status", () => {
    expect(simpleGridInstance.props.configurationForGrid[1].label).toBe(translate("status"));
  });

  it("grid third column header should be Created By", () => {
    expect(simpleGridInstance.props.configurationForGrid[2].label).toBe(translate("created_by"));
  });

  it("grid fourth column header should be Created Date", () => {
    expect(simpleGridInstance.props.configurationForGrid[3].label).toBe(translate("created_date"));
  });

  it("grid fifth column header should be Modified By", () => {
    expect(simpleGridInstance.props.configurationForGrid[4].label).toBe(translate("modified_by"));
  });

  it("grid sixth column header should be Last Modified Date", () => {
    expect(simpleGridInstance.props.configurationForGrid[5].label).toBe(translate("last_modified_date"));
  });

  it("grid first column values should not have links", () => {
    expect(simpleGridInstance.props.configurationForGrid[0].isLink).toBe(false);
  });

  it("Kebab menu has only one option", () => {
    expect(simpleGridInstance.props.configurationForGrid[0].configurationForKebabMenu.length).toEqual(1);
  });

  it("kebab menu has Edit option only", () => {
    expect(simpleGridInstance.props.configurationForGrid[0].configurationForKebabMenu[0].type).toBe("Edit");
  });
});
