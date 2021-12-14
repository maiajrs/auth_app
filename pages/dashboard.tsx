import { useEffect } from "react";
import signContext, { signOut } from "../context/AuthContext";
import { setupAPIClient } from "../services";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboad() {
  const { user } = signContext();
  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch(() => {
        signOut();
      });
  }, []);
  return <h1>Dashboad: {user?.email}</h1>;
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get("/me");
    console.log(response)
  return {
    props: {},
  };
});
