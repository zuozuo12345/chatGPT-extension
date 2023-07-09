export function logoPath(state_: "active" | "inactive") {
  let extension_ = ".png";
  const pathWithoutSize = `/logo/${state_}/scout-icon-`;

  return {
    "16": `${pathWithoutSize}16${extension_}`,
    "48": `${pathWithoutSize}48${extension_}`,
    "128": `${pathWithoutSize}128${extension_}`,
  };
}
