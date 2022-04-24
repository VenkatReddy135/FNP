import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import renderer from "react-test-renderer";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../../../../../assets/theme/theme";
import CreateContactUI from "../CreateContactUI";
const store = createStore(() => []);

const initialCreateObj = {
  toName: "Testing",
  attentionName: "Test",
  doorbell: "12",
  address1: "South gate, Pune",
  address2: "South gate, Pune",
  cityId: "",
  stateId: "",
  pincode: "831002",
  countryId: "",
  contactPurposeId: "",
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
            <CreateContactUI
              createObj={initialCreateObj}
              selectedContactTypeName="Postal Address"
              contactTypesList={[]}
              isPincodeInvalid
              contactPurposeList={[]}
              cities={[]}
              states={[]}
              countries={[]}
              countryCodes={[]}
              pincodeData={[]}
              handleContactTypeChange={() => null}
              cancelHandler={() => null}
              createContact={() => null}
              handlePincodeOnBlur={() => null}
              handlePincodeChange={() => null}
              handleCityStateCountryChange={() => null}
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
              <CreateContactUI
                createObj={initialCreateObj}
                selectedContactTypeName="Postal Address"
                contactTypesList={[]}
                isPincodeInvalid
                contactPurposeList={[]}
                cities={[]}
                states={[]}
                countries={[]}
                countryCodes={[]}
                pincodeData={[]}
                handleContactTypeChange={() => null}
                cancelHandler={() => null}
                createContact={() => null}
                handlePincodeOnBlur={() => null}
                handlePincodeChange={() => null}
                handleCityStateCountryChange={() => null}
              />
            </Router>
          </Provider>
        </ThemeProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
