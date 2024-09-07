import { createContext, useContext, useState, useEffect } from "react";
import { axiosRequest, axiosResponse } from "../api/axiosDefault";
import { useCurrentUser } from "./CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

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
          // Fetch participants data
          const { data: participantsData } = await axiosRequest.get(
            `/participants/?friendventure=${friendventureId}`
          );
          // Extract participant owner IDs (user IDs)
          const participantOwnerIds = participantsData.results.map(
            (participant) => participant.owner_id // Assuming participant contains owner ID
          );
          //  Fetch all profiles
          const { data: allProfilesData } = await axiosRequest.get(
            `/profiles/`
          );
          // Filter profiles based on participant owner IDs
          const fullProfiles = allProfilesData.results.filter(
            (profile) => participantOwnerIds.includes(profile.owner_id) //  use owner_id for filtering
          );

          //  Update state with filtered profiles
          setProfileData((prevState) => ({
            ...prevState,
            friendventureParticipants: {
              ...participantsData,
              results: fullProfiles, // Set the filtered profiles as results
            },
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
      const { data } = await axiosResponse.post("/followers/", {
        followed: clickedProfile.id,
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

  const handleUnfollow = async (clickedProfile) => {
    try {
      await axiosResponse.delete(`/followers/${clickedProfile.following_id}/`);
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        activeProfiles: {
          ...prevState.activeProfiles,
          results: prevState.activeProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        friendventureParticipants: {
          ...prevState.friendventureParticipants,
          results: prevState.friendventureParticipants.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
    } catch (error) {
      console.log(error);
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
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}
      >
        <SetFriendventureIdContext.Provider value={setFriendventureId}>
          {children}
        </SetFriendventureIdContext.Provider>
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
