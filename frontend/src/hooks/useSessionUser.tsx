import React, { createContext, useContext, useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";

import { REDUX_ROOT_STATE } from "../redux/store";
import {
  USER_DETAILS_DATA_TYPE,
  USER_TIER_DATA_TYPE,
} from "../typescript/v2/user";

interface SessionUserContextProviderType {
  authenticated?: boolean;
  consented?: boolean;
  sessionUserDetails?: USER_DETAILS_DATA_TYPE;
  accessToken?: string;
  subscriptionTier?: USER_TIER_DATA_TYPE["name"];
  isUserSubscribed?: boolean;
  children?: React.ReactNode;
  credits?: number;
}

const defaultValue: SessionUserContextProviderType = {
  authenticated: false,
  consented: false,
  sessionUserDetails: null,
  accessToken: null,
  subscriptionTier: "free",
  isUserSubscribed: false,
  credits: 0,
};

export const SessionUserContext = createContext(defaultValue);

export const useSessionUser = () => {
  return useContext(SessionUserContext);
};

export const SessionUserContextProvider = ({
  children,
}: SessionUserContextProviderType) => {
  const sessionUser = useSelector<REDUX_ROOT_STATE, REDUX_ROOT_STATE["user"]>(
    (state) => state.user,
    shallowEqual
  );

  const { details, accessToken, consented, job } = sessionUser;

  const consented_ = consented;

  const subscriptionTier: USER_TIER_DATA_TYPE["name"] =
    details && details.current_tier && details.current_tier.name
      ? details.current_tier.name
      : "free";
  const isUserSubscribed = subscriptionTier === "premium";

  const authenticated = accessToken && details && consented_ ? true : false;

  const credits =
    details && details.credits && typeof details.credits === "number"
      ? details.credits
      : 0;

  const context = useMemo(() => {
    return {
      authenticated,
      consented: consented_,
      sessionUserDetails: details,
      accessToken,
      subscriptionTier,
      isUserSubscribed,
      credits,
    };
  }, [
    authenticated,
    consented_,
    details,
    accessToken,
    subscriptionTier,
    isUserSubscribed,
    credits,
  ]);

  return (
    <SessionUserContext.Provider value={context}>
      {children}
    </SessionUserContext.Provider>
  );
};
