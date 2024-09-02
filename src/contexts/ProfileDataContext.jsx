import { createContext, useContext, useState, useEffect } from "react";
import { axiosRequest } from "../api/axiosDefault";
import { useCurrentUser } from "./CurrentUserContext";

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({children}) => {
    const [profileData, setProfileData] = useState({
        pageProfile: { results: [] },
        activeProfiles: { results: [] },
      });

      const currentUser = useCurrentUser();
    
      useEffect(() => {
        const handleMount = async () => {
          try {
            const { data } = await axiosRequest.get(
              `/profiles/?ordering=-friendventures_count`
            );
            setProfileData((prevState) => ({
              ...prevState,
              activeProfiles: data,
            }));
          } catch (error) {
            console.log(error);
          }
        };
        handleMount();
      }, [currentUser]);

      return (
        <ProfileDataContext.Provider value={profileData}>
            <SetProfileDataContext.Provider value={setProfileData}>
                {children}
            </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
      )
}