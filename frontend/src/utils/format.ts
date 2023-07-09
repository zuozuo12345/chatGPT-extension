export function titleCase(string: string) {
  try {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  } catch (error) {
    return string;
  }
}
