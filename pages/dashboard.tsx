import { useEffect } from "react";
import signContext, { signOut } from "../context/AuthContext";
import { api } from "../services";

export default function Dashboad() {
  const { user } = signContext();
  useEffect(() => {
    api.get("/me").then((response) => console.log(response)).catch(() => {
      console.log("USE_EFFECT_DASHBOARD")
      signOut()
    })
  }, []);
  return <h1>Dashboad: {user?.email}</h1>;
}
