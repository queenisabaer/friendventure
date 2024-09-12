import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { axiosRequest, axiosResponse } from "../api/axiosDefault";
import { useNavigate } from "react-router-dom";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const refreshAuthToken = async () => {
    try {
      await axios.post("/dj-rest-auth/token/refresh/");
      return true;
    } catch (err) {
      console.log("Token refresh failed", err);
      if (currentUser) {
        setCurrentUser(null); // If token refresh fails, log out the user
        navigate("/login"); // Redirect to login page
      }
      return false;
    }
  };

  // Fetch current user data when the component mounts if the token is valid
  const handleMount = async () => {
    const tokenValid = await refreshAuthToken();
    if (tokenValid) {
      try {
        const { data } = await axiosResponse.get("dj-rest-auth/user/");
        setCurrentUser(data);
      } catch (err) {
        console.log(err);
        setCurrentUser(null);
      }
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  // Set up Axios interceptors to handle token refresh before requests and on 401 responses
  useEffect(() => {
    const requestInterceptor = axiosRequest.interceptors.request.use(
      async (config) => {
        await refreshAuthToken();
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    const responseInterceptor = axiosResponse.interceptors.response.use(
      (response) => response, // Let the response pass through if successful
      async (err) => {
        if (err.response?.status === 401) { // If unauthorized, refresh token
          const tokenValid = await refreshAuthToken();
          if (tokenValid) {
            return axios(err.config);
          }
        }
        return Promise.reject(err); // Retry the failed request with a new token
      }
    );

    return () => {
      axiosRequest.interceptors.request.eject(requestInterceptor);
      axiosResponse.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
