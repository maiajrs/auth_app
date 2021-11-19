import axios, { AxiosError } from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];


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

        cookies = parseCookies();
        const { "next-auth.refreshToken": refreshToken } = cookies;
        const originalConfig = error.config;

         if (!isRefreshing) {
          isRefreshing = true;
          api
            .post("/refresh", { refreshToken })
            .then((response) => {
              const { token } = response.data;

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

              failedRequestsQueue.forEach((request) =>
                request.onSuccess(token)
              );

              failedRequestsQueue = [];
            })
            .catch((err) => {
              failedRequestsQueue.forEach((request) => request.onSuccess(err));
              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {

              reject(err);
            },
          });
        });
      } else {
        destroyCookie(undefined, "next-auth.token");
        destroyCookie(undefined, "next-auth.refreshToken");
      }
    }
  }
);
