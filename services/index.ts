import axios, { AxiosError } from "axios";
import Router from "next/router";
import { parseCookies, setCookie, destroyCookie } from "nookies";

let cookies = parseCookies();

console.log("oi do api");

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["next-auth.token"]}`,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (error.response?.data.code === "token.expired") {
        console.log('oi do refresh')
        cookies = parseCookies();
        const { "next-auth.refreshToken": refreshToken } = cookies;

        api.post("/refresh", { refreshToken }).then((response) => {
          const { token } = response.data;
          console.log(refreshToken, refreshToken);

          setCookie(undefined, "next-auth.token", token, {
            maxAge: 60 * 60 * 24 * 30, // 1 month
            path: "/",
          });
          setCookie(
            undefined,
            "next-auth.refreshToken",
            response.data.refreshToken,
            {
              maxAge: 60 * 60 * 24 * 30, // 1 month
              path: "/",
            }
          );
          api.defaults.headers["Authorization"] = `Bearer ${token}`;
        });
        // Router.push(`${api.getUri}`)
      } else {
        destroyCookie(undefined, "next-auth.token");
        destroyCookie(undefined, "next-auth.refreshToken");
        // Router.push(`${api.getUri}`)
      }
    }
  }
);
