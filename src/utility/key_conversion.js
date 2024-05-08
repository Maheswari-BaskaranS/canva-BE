/* eslint-disable no-unsafe-optional-chaining */
const KeyConversion = {};

KeyConversion.convertCamelCase = (postData) => {
  const extractedKey = postData
    ?.replace(/[^a-zA-Z0-9\s]/g, '')
    ?.toLowerCase()
    ?.split(' ');
  const resultKey = extractedKey?.map((val, index) => {
    if (index === 0) {
      return val;
    }
    return val?.charAt(0)?.toUpperCase() + val?.slice(1);
  });
  return resultKey?.join('');
};

module.exports = KeyConversion;
