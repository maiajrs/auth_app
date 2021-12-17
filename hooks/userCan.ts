import signContext from "../context/AuthContext";
import { validateUserPermissions } from "../utils/validateUserPermissions";

type UserCanProps = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions = [], roles = [] }: UserCanProps) {
  const { user, isAuthenticated } = signContext();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({user, permissions, roles})

  return userHasValidPermissions;
}
