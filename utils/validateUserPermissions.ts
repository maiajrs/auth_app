type User = {
  permissions: string[];
  roles: string[];
};

interface ValidateUserPermissionsParams {
  user: User | undefined;
  permissions: string[] | undefined;
  roles: string[] | undefined;
}

export function validateUserPermissions({
  user,
  permissions,
  roles,
}: ValidateUserPermissionsParams) {
  if (permissions.length > 0) {
    const hasAllPermissions = permissions?.every((permission) => {
      return user?.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles.length > 0) {
    const hasAllroles = roles?.every((role) => {
      return user?.roles.includes(role);
    });

    if (!hasAllroles) {
      return false;
    }
  }
  return true;
}
