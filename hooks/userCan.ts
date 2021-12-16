import signContext from "../context/AuthContext";

type UserCanProps = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions = [], roles = [] }: UserCanProps) {
  const { user, isAuthenticated } = signContext();

  if (!isAuthenticated) {
    return false;
  }

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
