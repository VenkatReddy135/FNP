import PropTypes from "prop-types";
/**
 * @function viewEditRelationPropType propType data for view edit relation
 * @returns {object} return propType data
 */
const viewEditRelationPropType = () => ({
  isEditable: PropTypes.bool.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  formUpdateData: PropTypes.func.isRequired,
  showPopup: PropTypes.func.isRequired,
  switchToEditHandler: PropTypes.func.isRequired,
  handlePartyChange: PropTypes.func.isRequired,
  handleDate: PropTypes.func.isRequired,
  partyToRoles: PropTypes.shape({
    primary: PropTypes.shape({
      roleId: PropTypes.string.isRequired,
      roleName: PropTypes.string.isRequired,
      primary: PropTypes.bool.isRequired,
    }).isRequired,
    other: PropTypes.arrayOf(
      PropTypes.shape({
        roleId: PropTypes.string.isRequired,
        roleName: PropTypes.string.isRequired,
        primary: PropTypes.bool.isRequired,
      }).isRequired,
    ).isRequired,
    toRole: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  relationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  fromPartyRoles: PropTypes.shape({
    primary: PropTypes.shape({
      roleId: PropTypes.string.isRequired,
      roleName: PropTypes.string.isRequired,
      primary: PropTypes.bool.isRequired,
    }).isRequired,
    other: PropTypes.arrayOf(
      PropTypes.shape({
        roleId: PropTypes.string.isRequired,
        roleName: PropTypes.string.isRequired,
        primary: PropTypes.bool.isRequired,
      }).isRequired,
    ).isRequired,
    fromRole: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  responseData: PropTypes.shape({
    fromThePartyId: PropTypes.string.isRequired,
    ofPartyName: PropTypes.string.isRequired,
    partyName: PropTypes.string.isRequired,
  }).isRequired,
  editRelationObj: PropTypes.shape({
    fromDate: PropTypes.string,
    fromThePartyId: PropTypes.string.isRequired,
    inTheRoleOfFromTheParty: PropTypes.string.isRequired,
    inTheRoleOfPartyTo: PropTypes.string.isRequired,
    isA: PropTypes.string.isRequired,
    toDate: PropTypes.string,
  }).isRequired,
});

export default viewEditRelationPropType;
