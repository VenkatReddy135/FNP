/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import StarRating from "..";

describe(`Star Rating component test cases`, () => {
  const props = {
    record: {
      overallRating: 5,
    },
    source: "overallRating",
  };

  beforeEach(() => {
    render(<StarRating {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Star Rating component", () => {
    expect(screen.getByTestId("star-rating")).toBeTruthy();
  });

  it("should render exact rating", () => {
    const ratingElement = screen.getByTestId("star-rating");
    const labeAttribute = ratingElement.attributes.getNamedItem("aria-label");
    expect(labeAttribute.value).toBe("5 Stars");
  });

  it("should match snapshot", () => {
    const tree = renderer.create(<StarRating {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
