// import React, { createContext, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "./AuthContext";
// import createAuthRefreshInterceptor from "axios-auth-refresh";
// import * as Keychain from "react-native-keychain";

// const AxiosContext = createContext();
// const { Provider } = AxiosContext;

// const AxiosProvider = ({ children }) => {
//   const authContext = useContext(AuthContext);

//   const authAxios = axios.create({
//     baseURL: "https://b636-115-99-178-40.ngrok-free.app/jwt",
//   });

//   const publicAxios = axios.create({
//     baseURL: "https://b636-115-99-178-40.ngrok-free.app/jwt",
//   });

//   authAxios.interceptors.request.use(
//     (config) => {
//       if (!config.headers.Authorization) {
//         config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
//       }

//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   const refreshAuthLogic = (failedRequest) => {
//     const data = {
//       refreshToken: authContext.authState.refreshToken,
//     };

//     const options = {
//       method: "POST",
//       data,
//       url: "https://b636-115-99-178-40.ngrok-free.app/jwt/refreshToken",
//     };

//     return axios(options)
//       .then(async (tokenRefreshResponse) => {
//         failedRequest.response.config.headers.Authorization =
//           "Bearer " + tokenRefreshResponse.data.refreshToken;

//         authContext.setAuthState({
//           ...authContext.authState,
//           refreshToken: tokenRefreshResponse.data.refreshToken,
//         });

//         await Keychain.setGenericPassword(
//           "token",
//           JSON.stringify({
//             // accessToken: tokenRefreshResponse.data.accessToken,
//             refreshToken: authContext.authState.refreshToken,
//           })
//         );

//         return Promise.resolve();
//       })
//       .catch((e) => {
//         authContext.setAuthState({
//           //   accessToken: null,
//           refreshToken: null,
//         });
//       });
//   };

//   createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

//   return (
//     <Provider
//       value={{
//         authAxios,
//         publicAxios,
//       }}
//     >
//       {children}
//     </Provider>
//   );
// };

// export { AxiosContext, AxiosProvider };
