export const isAuthorized = (userId, roles) => {
  if (!userId) return false;
  
  return !roles || Roles.userIsInRole(userId, roles);
}
