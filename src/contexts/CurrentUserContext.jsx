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
      setCurrentUser(null);
      navigate("/login");
      return false;
    }
  };

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
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          const tokenValid = await refreshAuthToken();
          if (tokenValid) {
            return axios(err.config);
          }
        }
        return Promise.reject(err);
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
