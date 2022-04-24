import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CategoryTaxonomy from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
}));

describe("Category Taxonomy Component test cases", () => {
  let result;
  beforeEach(() => {
    result = render(<CategoryTaxonomy category={{ updatedBy: "FNP" }} />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render the component without crashing", () => {
    expect(result).toBeTruthy();
  });

  it("should have taxonomy details label", () => {
    expect(screen.getByText("taxonomy_details")).toBeInTheDocument();
  });

  it("should have category domain name label ", () => {
    expect(screen.getByText("category_domain_name")).toBeInTheDocument();
  });

  it("should have category geography label", () => {
    expect(screen.getByText("category_geography")).toBeInTheDocument();
  });

  it("should have category occasion label", () => {
    expect(screen.getByText("category_occ")).toBeInTheDocument();
  });

  it("should have created by label", () => {
    expect(screen.getByText("created_by")).toBeInTheDocument();
  });

  it("should have last modified label", () => {
    expect(screen.getByText("Last Modified Date")).toBeInTheDocument();
  });

  it("should have last modified by ", () => {
    expect(screen.getByText("FNP")).toBeInTheDocument();
  });
});
