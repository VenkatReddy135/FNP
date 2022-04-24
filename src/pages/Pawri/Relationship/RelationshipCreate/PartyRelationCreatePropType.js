import PropTypes from "prop-types";
/**
 * @function partyRelationCreatePropType propType data for create relation
 * @returns {object} return propType data for create relation ui component
 */
const partyRelationCreatePropType = () => ({
  partyName: PropTypes.string.isRequired,
  updateFormData: PropTypes.func.isRequired,
  handleDate: PropTypes.func.isRequired,
  cancelTagHandler: PropTypes.func.isRequired,
  handlePartyChange: PropTypes.func.isRequired,
  toRolesData: PropTypes.shape({
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
  relationType: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired, id: PropTypes.string.isRequired }).isRequired,
  ).isRequired,
  fromRolesData: PropTypes.shape({
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
  relationData: PropTypes.shape({
    fromDate: PropTypes.string,
    fromThePartyId: PropTypes.string.isRequired,
    inTheRoleOfFromTheParty: PropTypes.string.isRequired,
    inTheRoleOfPartyTo: PropTypes.string.isRequired,
    isA: PropTypes.string.isRequired,
    toDate: PropTypes.string,
  }).isRequired,
});
export default partyRelationCreatePropType;
