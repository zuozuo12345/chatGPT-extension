import { PUBLIC_SKILL_DATA_TYPE } from "../../../../../typescript/types/candidate";

export function publicProfileSkillsCrawler(skillElements) {
  try {
    let skills: PUBLIC_SKILL_DATA_TYPE[] = [];

    for (let item of skillElements) {
      if (
        item["components"]["entityComponent"] &&
        item["components"]["entityComponent"]["title"]
      ) {
        const entityComponent = item["components"]["entityComponent"];

        if (entityComponent["title"] && entityComponent["title"]["text"]) {
          let passedAssessment = false;
          let num_endorsements = 0;

          if (
            entityComponent["subComponents"] &&
            entityComponent["subComponents"]["components"] &&
            typeof entityComponent["subComponents"]["components"] ===
              "object" &&
            entityComponent["subComponents"]["components"].length > 0
          ) {
            entityComponent["subComponents"]["components"].forEach(
              (subCompComp) => {
                if (
                  subCompComp["components"] &&
                  subCompComp["components"]["insightComponent"] &&
                  subCompComp["components"]["insightComponent"]["text"] &&
                  subCompComp["components"]["insightComponent"]["text"][
                    "text"
                  ] &&
                  subCompComp["components"]["insightComponent"]["text"]["text"][
                    "text"
                  ]
                ) {
                  if (
                    subCompComp["components"]["insightComponent"]["text"][
                      "text"
                    ]["text"].toLowerCase() ===
                    "passed linkedin skill assessment"
                  ) {
                    passedAssessment = true;
                  }
                }
              }
            );
          }

          if (
            entityComponent["supplementaryInfo"] &&
            entityComponent["supplementaryInfo"]["text"]
          ) {
            const check_ = parseInt(
              entityComponent["supplementaryInfo"]["text"]
                .replace(/\s/g, "")
                .replace(/\W+/g, "")
            );

            if (!isNaN(check_)) {
              num_endorsements = check_;
            }
          }

          skills.push({
            name: entityComponent["title"]["text"] ?? null,
            passed_linkedin_assessment: passedAssessment,
            num_endorsements: num_endorsements,
          } as PUBLIC_SKILL_DATA_TYPE);
        }
      }
    }

    return {
      skills,
    };
  } catch (error) {
    return {
      skills: [],
    };
  }
}
