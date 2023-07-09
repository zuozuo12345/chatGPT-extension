export const NAUKRI_APPLICANT_LIST_COUNT = 40;

export const NAUKRI_PAGE_REFERENCE = "EAPPS";

export const FIXED_NAUKRI_HEADERS = {
  accept: "application/json",
  "accept-language": "en-US,en;q=0.9",
  appid: "4",
  "cache-control": "max-age=0",
  "content-type": "application/json",
  gid: "INDUSTRY,LOCATION,EDUCATION,FAREA_ROLE,KEYSKILLS",
  "sec-ch-ua":
    '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  systemid: "naukriIndia",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export const getDefaultJobApplicantListFilter = (
  fromDate: number,
  toDate: number
) => {
  return {
    applyDate: {
      from: fromDate,
      to: toDate,
    },
    keywords: [],
    skillKeys: { skillKeysAnd: [], skillKeysOr: [] },
    questionnaire: [],
    facets: {
      VIDEO_PROFILE: {
        selected: [],
        isOpen: true,
      },
      RATING: {
        selected: [],
        isOpen: true,
      },
      RATING_TAG: {
        selected: [],
        isOpen: true,
      },
      CURR_CITY: {
        selected: [],
        isOpen: false,
      },
      TOTALEXPYEAR: {
        selected: [
          {
            start: 0,
            end: 31,
          },
        ],
        min: 0,
        max: 31,
        bucketSize: 6,
        isOpen: false,
      },
      NOTICE_PERIOD: {
        selected: [],
        isOpen: false,
      },
      CTC_LACS: {
        selected: [
          {
            start: 0,
            end: 1000,
          },
        ],
        includeNotMentioned: true,
        min: 0,
        max: 1000,
        bucketSize: 167,
        isOpen: false,
      },
      INSTITUTE_KEYS: {
        selected: [],
        isOpen: false,
      },
      EMPLOYER_KEYS: {
        selected: [],
        isOpen: false,
      },
      DESIGNATION_KEYS: {
        selected: [],
        isOpen: false,
      },
      FA_ID: {
        selected: [],
        isOpen: false,
      },
      IND_ID: {
        selected: [],
        isOpen: false,
      },
      ALLEDU: {
        selected: [],
        isOpen: false,
      },
      GENDER: {
        selected: [],
        isOpen: false,
      },
    },
    tab: "ALL",
    subTab: "ALL",
  };
};
