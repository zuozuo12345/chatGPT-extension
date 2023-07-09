export interface fetchSettingsFromScoutWebResponseType {
  settings: {
    monster: {
      crawlSource: "ext" | "web";
      urls?: string[];
    };
    naukri: {
      crawlSource: "ext" | "web";
      urls: string[];
    };
  };
}
