import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useSelector, shallowEqual } from "react-redux";

import { REDUX_ROOT_STATE } from "../redux/store";
import {
  NORMALISED_CANDIDATE_JOBS_LIST_TYPE,
  STORED_CANDIDATE_DATA_TYPE,
} from "../typescript/types/candidate";
import { normaliseData } from "../utils/normalizr";

interface ProfileDetailsContextProviderType {
  profileData?: STORED_CANDIDATE_DATA_TYPE;
  openToWork?: boolean;
  diversifyHire?: boolean;
  profilePic?: string;
  isHackerTrailMember?: boolean;
  emails?: string[];
  phones?: string[];
  detailsMasked?: boolean;
  jobMatchingList?: NORMALISED_CANDIDATE_JOBS_LIST_TYPE;
  linkedinUsername?: string;
  profileId?: string;
  children?: React.ReactNode;
}

const defaultValue: ProfileDetailsContextProviderType = {
  profileData: null,
  openToWork: false,
  diversifyHire: false,
  profilePic: null,
  isHackerTrailMember: false,
  emails: [],
  phones: [],
  jobMatchingList: {},
  linkedinUsername: null,
  profileId: null,
  detailsMasked: false,
};

export const ProfileDetailsContext = createContext(defaultValue);

export const useProfileDetails = () => {
  return useContext(ProfileDetailsContext);
};

export const ProfileDetailsContextProvider = ({
  children,
}: ProfileDetailsContextProviderType) => {
  const profileLinkedinUsername = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["profile"]["username"]["linkedin"]
  >((state) => state.profile.username.linkedin, shallowEqual);
  const profileData = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["profile"]["details"]["profileDetails"]
  >((state) => state.profile.details.profileDetails, shallowEqual);

  const [jobMatchingList, setJobMatchingList] =
    useState<NORMALISED_CANDIDATE_JOBS_LIST_TYPE>({});

  // On component mount, normalise the job matching list
  useEffect(() => {
    if (profileData && profileData.jobs.length > 0) {
      const normaliseJobMatchingList: NORMALISED_CANDIDATE_JOBS_LIST_TYPE =
        normaliseData(profileData.jobs, (value, parent) => value.job.id);

      setJobMatchingList(normaliseJobMatchingList);
    } else if (!profileData) {
      setJobMatchingList({});
    }
  }, [profileData]);

  const openToWork = profileData && profileData.open_to_work ? true : false;
  const diversifyHire =
    profileData &&
    profileData.gender &&
    profileData.gender !== undefined &&
    profileData.gender !== null &&
    profileData.gender === "female"
      ? true
      : false;
  const profilePic =
    profileData &&
    profileData.profile.display_image_base64 &&
    profileData.profile.display_image_base64.replace(/\s/g, "") !== "" &&
    profileData.profile.display_image_base64 !== "*"
      ? `data:image/jpeg;base64, ${profileData.profile.display_image_base64}`
      : null;
  const isHackerTrailMember =
    profileData && profileData.is_member ? true : false;

  const emails =
    profileData && profileData.profile && profileData.profile.email
      ? typeof profileData.profile.email === "object"
        ? [...profileData.profile.email]
        : [profileData.profile.email]
      : ["-"];

  const profilePrimaryPhoneNumber =
    profileData &&
    profileData.profile &&
    profileData.profile.phone &&
    typeof profileData.profile.phone === "string"
      ? profileData.profile.phone
      : null;
  const phones =
    profileData &&
    profileData.profile &&
    profileData.profile.phones &&
    typeof profileData.profile.phones === "object" &&
    profileData.profile.phones.length > 0
      ? [...profileData.profile.phones]
      : profilePrimaryPhoneNumber
      ? [profilePrimaryPhoneNumber]
      : ["-"];

  const detailsMasked =
    profileData &&
    profileData.masked_details &&
    profileData.masked_details !== null &&
    profileData.masked_details !== undefined
      ? profileData.masked_details
      : false;

  const linkedinUsername = profileLinkedinUsername
    ? profileLinkedinUsername
    : null;

  const profileId =
    profileData && profileData.profile_id ? profileData.profile_id : null;

  const context = useMemo(() => {
    return {
      profileData,
      openToWork,
      diversifyHire,
      profilePic,
      isHackerTrailMember,
      emails,
      phones,
      detailsMasked,
      jobMatchingList,
      linkedinUsername,
      profileId,
    };
  }, [
    profileData,
    openToWork,
    diversifyHire,
    profilePic,
    isHackerTrailMember,
    emails,
    phones,
    detailsMasked,
    jobMatchingList,
    linkedinUsername,
    profileId,
  ]);

  return (
    <ProfileDetailsContext.Provider value={context}>
      {children}
    </ProfileDetailsContext.Provider>
  );
};
