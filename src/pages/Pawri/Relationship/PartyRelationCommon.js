/**
 * @param {Array} roles  array of roles
 * @function  filterRoles to filter the roles in the array for the component
 * @returns {object} returns filtered object of array
 */
const filterRoles = (roles) => {
  const primaryRole = roles && roles.find((role) => role && role.primary);
  const otherRole = roles && roles.filter((role) => role && role.primary === false);
  return { primary: primaryRole, other: otherRole };
};
export default filterRoles;
