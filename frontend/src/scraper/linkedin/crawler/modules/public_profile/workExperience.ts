import { PUBLIC_EXPERIENCE_DATA_TYPE } from "../../../../../typescript/types/candidate";

export async function publicProfileWorkExperienceCrawler(
  workExpApiResponse: any
): Promise<{
  workExps: PUBLIC_EXPERIENCE_DATA_TYPE[];
}> {
  try {
    if (
      !(
        workExpApiResponse &&
        workExpApiResponse["data"] &&
        workExpApiResponse["data"]["data"] &&
        workExpApiResponse["data"]["data"][
          "identityDashProfileComponentsByPagedListComponent"
        ] &&
        workExpApiResponse["data"]["data"][
          "identityDashProfileComponentsByPagedListComponent"
        ]["elements"] &&
        typeof workExpApiResponse["data"]["data"][
          "identityDashProfileComponentsByPagedListComponent"
        ]["elements"] === "object" &&
        workExpApiResponse["data"]["data"][
          "identityDashProfileComponentsByPagedListComponent"
        ]["elements"].length > 0
      )
    ) {
      throw "No data";
    }

    const workExpCrawlerDataResponse = workExpApiResponse["data"];
    const workExpCrawlerIncludedResponse = workExpApiResponse["included"];

    if (!workExpCrawlerDataResponse) {
      throw "no data";
    }

    const includedComponents = retrieveIncludedComponent(
      workExpCrawlerIncludedResponse
    );
    const workExps: PUBLIC_EXPERIENCE_DATA_TYPE[] = [];

    const workExpElements =
      workExpCrawlerDataResponse["data"] &&
      workExpCrawlerDataResponse["data"][
        "identityDashProfileComponentsByPagedListComponent"
      ] &&
      workExpCrawlerDataResponse["data"][
        "identityDashProfileComponentsByPagedListComponent"
      ]["elements"] &&
      typeof workExpCrawlerDataResponse["data"][
        "identityDashProfileComponentsByPagedListComponent"
      ]["elements"] === "object" &&
      workExpCrawlerDataResponse["data"][
        "identityDashProfileComponentsByPagedListComponent"
      ]["elements"].length > 0
        ? workExpCrawlerDataResponse["data"][
            "identityDashProfileComponentsByPagedListComponent"
          ]["elements"]
        : [];

    if (workExpElements.length > 0) {
      for (const workExpElement of workExpElements) {
        if (
          workExpElement["components"] &&
          workExpElement["components"]["entityComponent"] &&
          workExpElement["components"]["entityComponent"]["title"] &&
          typeof workExpElement["components"]["entityComponent"]["title"] ===
            "object" &&
          workExpElement["components"]["entityComponent"]["title"]["text"] &&
          typeof workExpElement["components"]["entityComponent"]["title"][
            "text"
          ] === "string"
        ) {
          const entityComponent =
            workExpElement["components"]["entityComponent"];
          const recipeTypeObj =
            workExpElement["$recipeTypes"] &&
            workExpElement["$recipeTypes"].length > 0
              ? workExpElement["$recipeTypes"]
              : null;

          console.log({
            logic:
              recipeTypeObj &&
              typeof recipeTypeObj === "object" &&
              recipeTypeObj.length > 0 &&
              includedComponents.length > 0,
            includedComponents,
            recipeTypeObj,
          });

          if (
            recipeTypeObj &&
            typeof recipeTypeObj === "object" &&
            recipeTypeObj.length > 0 &&
            includedComponents.length > 0
          ) {
            const recipeType = recipeTypeObj[0];

            const anyAdditionalInfo = includedComponents.find((item) => {
              if (
                item["components"]["elements"] &&
                item["components"]["elements"].length > 0 &&
                item["components"]["elements"][0]["$recipeTypes"] &&
                item["components"]["elements"][0]["$recipeTypes"].length > 0
              ) {
                return (
                  item["components"]["elements"][0]["$recipeTypes"][0] ===
                  recipeType
                );
              }

              return false;
            });

            if (anyAdditionalInfo) {
              const anyAdditionalInfoElements =
                anyAdditionalInfo["components"]["elements"];

              if (anyAdditionalInfoElements) {
                console.log({
                  anyAdditionalInfo,
                  workExpElement,
                });
              }
            } else {
              let workExp: PUBLIC_EXPERIENCE_DATA_TYPE = {
                job_title: null,
                company_name: null,
                job_subtitles: null,
                dates: null,
                duration: null,
                location: null,
                description: null,
              };

              if (
                entityComponent["title"] &&
                entityComponent["title"]["text"] &&
                entityComponent["subtitle"] &&
                entityComponent["subtitle"]["text"]
              ) {
                if (entityComponent["title"]["text"]) {
                  workExp.job_title = entityComponent["title"]["text"] ?? null;
                  workExp.company_name =
                    entityComponent["subtitle"]["text"] ?? null;
                }
              }

              if (
                entityComponent["caption"] &&
                entityComponent["caption"]["text"] &&
                entityComponent["caption"]["text"].split("·").length > 0
              ) {
                workExp.dates = `${entityComponent["caption"]["text"]
                  .split("·")[1]
                  .replace(/^\s+/g, "")}`;
                workExp.duration = `${entityComponent["caption"]["text"]
                  .split("·")[0]
                  .replace(/\s+$/, "")}`;
              }

              if (
                entityComponent["metaData"] &&
                entityComponent["metaData"]["text"]
              ) {
                workExp.location = entityComponent["metaData"]["text"] ?? null;
              }

              if (
                entityComponent["subComponents"] &&
                entityComponent["subComponents"]["components"] &&
                typeof entityComponent["subComponents"]["components"] ===
                  "object" &&
                entityComponent["subComponents"]["components"].length > 0
              ) {
                const firstItem =
                  entityComponent["subComponents"]["components"][0];

                if (
                  firstItem["components"] &&
                  firstItem["components"]["textComponent"] &&
                  firstItem["components"]["textComponent"]["text"] &&
                  firstItem["components"]["textComponent"]["text"]["text"]
                ) {
                  workExp.description =
                    firstItem["components"]["textComponent"]["text"]["text"];
                }
              }

              if (workExp.job_title && workExp.company_name) {
                workExps.push(workExp);
              }
            }
          }
        }
      }
    }

    return {
      workExps,
    };
  } catch (error) {
    return {
      workExps: [],
    };
  }
}

export function retrieveIncludedComponent(workExpCrawlerIncludedResponse: any) {
  try {
    const includedComp = [];

    if (!workExpCrawlerIncludedResponse) {
      throw "missing included comp";
    }

    if (
      workExpCrawlerIncludedResponse &&
      typeof workExpCrawlerIncludedResponse === "object" &&
      workExpCrawlerIncludedResponse.length > 0
    ) {
      for (let item_ of workExpCrawlerIncludedResponse) {
        if (
          item_["$type"] ===
            "com.linkedin.voyager.dash.identity.profile.tetris.PagedListComponent" &&
          item_["components"]["$recipeTypes"] &&
          typeof item_["components"]["$recipeTypes"] === "object" &&
          item_["components"]["$recipeTypes"].length > 0
        ) {
          includedComp.push(item_);
        }
      }
    }

    return includedComp;
  } catch (error) {
    return [];
  }
}
