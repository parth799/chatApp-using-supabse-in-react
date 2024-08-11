export const getInit = (name) => {
  // Split the name into individual words
  const words = name.split(/\s+/);

  // Filter out connectors and extract the first letter of each word
  const initials = words
    .filter((word) => !["and", "&", "_"].includes(word.toLowerCase()))
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  // Ensure the length of the initials is exactly 2 characters
  return initials.substring(0, 2);
};