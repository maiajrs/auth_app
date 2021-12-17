import { ReactNode } from "react";
import { useCan } from "../hooks/userCan";

interface CanProps {
    children: ReactNode;
    permissions?: string[];
    roles?: string[]
}


export default function Can({children, permissions, roles}: CanProps) {
    const userCanSeeComponent = useCan({permissions, roles})

    if (!userCanSeeComponent) {
        return null;
    }

    return (
        <>
            {children}
        </>
    )
}