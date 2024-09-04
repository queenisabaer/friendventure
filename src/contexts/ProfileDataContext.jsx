import { createContext, useContext, useState, useEffect } from "react";
import { axiosRequest, axiosResponse } from "../api/axiosDefault";
import { useCurrentUser } from "./CurrentUserContext";
import { followHelper } from "../utils/utils";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();
const FriendventureIdContext = createContext();
const SetFriendventureIdContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);
export const useFriendventureId = () => useContext(FriendventureIdContext);
export const useSetFriendventureId = () =>
  useContext(SetFriendventureIdContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    activeProfiles: { results: [] },
    friendventureParticipants: { results: [] },
  });

  const currentUser = useCurrentUser();
  const [friendventureId, setFriendventureId] = useState(null);

  useEffect(() => {
    const fetchFriendventureParticipants = async () => {
      if (friendventureId) {
        try {
          const { data } = await axiosRequest.get(
            `/participants/?friendventure=${friendventureId}`
          );
          setProfileData((prevState) => ({
            ...prevState,
            friendventureParticipants: data,
          }));
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchFriendventureParticipants();
  }, [friendventureId]);

  const handleFollow = async (clickedProfile) => {
    try {
      const { data: profileData } = await axiosRequest.get(
        `/profiles/?owner=${clickedProfile.owner}`
      );
      const profileId = profileData.results[0]?.id;
      const { data } = await axiosResponse.post("/followers/", {
        followed: profileId,
      });

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        activeProfiles: {
          ...prevState.activeProfiles,
          results: prevState.activeProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        friendventureParticipants: {
          ...prevState.friendventureParticipants,
          results: prevState.friendventureParticipants.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

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
      <SetProfileDataContext.Provider value={{ setProfileData, handleFollow }}>
        <SetFriendventureIdContext.Provider value={setFriendventureId}>
          {children}
        </SetFriendventureIdContext.Provider>
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
