import { filterPostObject } from "../index";

const postObj = {
  contactEmailId: "",
  contactPhoneNumber: "",
  loginId: null,
  partyId: "ABC_001",
  partyName: "XYZ",
  partyTypeId: "PT_00002",
};
const filteredPostObj = { partyId: "ABC_001", partyName: "XYZ", partyTypeId: "PT_00002" };

describe("filterPostObject", () => {
  it("should filter empty values in post search object", () => {
    const result = filterPostObject(postObj);
    expect(result).toStrictEqual(filteredPostObj);
  });
});
