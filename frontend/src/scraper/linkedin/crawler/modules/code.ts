export function rpsRetrieveCodeJson() {
  try {
    const code_tags = document.querySelectorAll("code");
    let profileCodeJson = null;

    for (let i = 0; i < code_tags.length; i++) {
      let innerText = null;

      try {
        innerText = JSON.parse(code_tags[i].innerText);
      } catch (e) {
        innerText = null;
      }

      if (innerText?.contactInfo) {
        profileCodeJson = innerText;
      }
    }

    return {
      profileCodeJson: profileCodeJson,
    };
  } catch (err) {
    return {
      profileCodeJson: null,
    };
  }
}
