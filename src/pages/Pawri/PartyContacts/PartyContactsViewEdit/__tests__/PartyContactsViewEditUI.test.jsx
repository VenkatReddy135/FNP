import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import renderer from "react-test-renderer";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../../../../../assets/theme/theme";
import PartyContactsViewEditUI from "../PartyContactsViewEditUI";
const store = createStore(() => []);

const initialResponseObj = {
  toName: "Testing",
  attentionName: "Test",
  doorbell: "12",
  address1: "South gate, Pune",
  address2: "South gate, Pune",
  cityId: "jamshedpur",
  stateId: "IN-JH",
  pincode: "831002",
  countryId: "IND",
  contactPurposeId: "T_00092",
  contactTypeId: "T_00001",
  email: "",
  phone: "",
  fromDate: "2021-06-26T05:10:10",
  throughDate: "2021-06-27T05:10:10",
  countryCode: "+91",
};

describe("render without crashing the component", () => {
  it("renders", () => {
    render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <PartyContactsViewEditUI
              handleCityStateCountryChange={() => null}
              handleChange={() => null}
              updateContact={() => null}
              cancelHandler={() => null}
              responseData={initialResponseObj}
              isEditable
              isPincodeInvalid
              contactPurposes={[]}
              switchToEditHandler={() => null}
              countryList={[]}
              stateList={[]}
              citiesList={[]}
              countryCodes={[]}
              pinCodesInfo={[]}
              countryCodes={[]}
            />
          </Router>
        </Provider>
      </ThemeProvider>,
    );
  });

  it("matches snapshot", () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Router>
              <PartyContactsViewEditUI
                handleCityStateCountryChange={() => null}
                handleChange={() => null}
                updateContact={() => null}
                cancelHandler={() => null}
                responseData={initialResponseObj}
                isEditable
                isPincodeInvalid
                contactPurposes={[]}
                switchToEditHandler={() => null}
                countryList={[]}
                stateList={[]}
                citiesList={[]}
                countryCodes={[]}
                pinCodesInfo={[]}
                countryCodes={[]}
              />
            </Router>
          </Provider>
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
