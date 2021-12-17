import { useEffect } from "react";
import Can from "../components";
import signContext, { signOut } from "../context/AuthContext";
import { useCan } from "../hooks/userCan";
import { setupAPIClient } from "../services";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboad() {
  const { user } = signContext();

  
  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log("dashboard"))
      .catch(() => {
        signOut();
      });
  }, []);
  return (
    <div>
      <h1>Dashboad: {user?.email}</h1>

      <Can permissions={["metrics.list"]}>
        <h1>Metrics</h1>
      </Can>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  await apiClient.get("/me");

  return {
    props: {},
  };
});
