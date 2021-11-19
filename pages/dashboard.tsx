import { useEffect } from "react";
import signContext from "../context/AuthContext";
import { api } from "../services";

export default function Dashboad() {
  const { user } = signContext();
  useEffect(() => {
    console.log('oi dash')
    api.get("/me").then((response) => console.log(response));
  }, []);
  return <h1>Dashboad: {user?.email}</h1>;
}
