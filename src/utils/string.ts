/**
 * Converts a string to user friendly sentance.
 * @param {string |string[]} str - String to be prettified
 * @returns A prettified string for user readablity.
 */
 export function prettifyString(str: string | string[]): string {
   const finalString = Array.isArray(str) ? str.join(', ') : str;
   
   // https://stackoverflow.com/a/4149393/6541770
   // https://stackoverflow.com/a/25658003/6541770
  return finalString
    .replace(/([A-Z])/g, ' $1') // insert a space before all caps
    .replace(/,(?=[^,]*$)/, ' and') // Replace last comma with and
    .toLowerCase()
    .replace(/  +/g, ' ') // Replace all extra spaces with single space
    .trim()
    .replace(/^./, function (str) { return str.toUpperCase(); }); // uppercase the first character
}
 