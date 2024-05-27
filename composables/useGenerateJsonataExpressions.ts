import { isArray, isNumber, snake } from "radash";

export const ROOT_PATH_DISPLAY_NAME = "root";

export const JSONATA_SINGLE_KEY_EXPRESSION_REGEX =
  /^(\$)(?:\.(.*))?{([^{}]+)}\[\]$/;

export const useGenerateJsonataExpressions = () => {
  function generateSingleKeyExpressions(json: object, prefix = "$") {
    const nestedObject: Array<{ json: object; path: string }> = [
      { json, path: prefix }, // tim.nguyen 2024/05/26: First path is the prefix itself. Jsonata will return the original object
    ];
    const result: Array<string> = [];

    while (nestedObject.length > 0) {
      const { json, path } = nestedObject.pop()!;

      Object.entries(json).forEach(([key, value]) => {
        let newPath = "";
        /**
         * BUG: When json is array type --> The algorithm will pushing all the array elements to --> Duplicate field
         *
         * Solution: Detect array element --> Not do anything
         */
        if (key.match(/^[0-9]*$/)) {
          newPath = `${path}`;
        } else {
          newPath = `${path}.${key}`;
        }

        if (value && typeof value === "object") {
          // tim.nguyen 2024/05/27: Allow key that is nested object to be parse in jsonata too
          /**
           * BUG: When json is array type --> The algorithm will pushing all the array elements to --> Duplicate field
           *
           * Solution: Detect array element --> Not do anything
           */
          if (!key.match(/^[0-9]*$/)) {
            result.push(`${path}.{ "${snake(key)}": ${key} }[]`);
          }

          // tim.nguyen 2024/05/27: Also, give option to flatten nested object
          /**
           * BUG: Push json is array type to nestedObject --> Result in jsonata expression to be like this:
           * $.data.order_list.recipient_address.address_line_list.{
           *   "0": 0,
           *   "1": 1,
           *   "2": 2,
           *   "3": 3
           * }[]
           */
          nestedObject.push({ json: value, path: newPath });
        } else {
          // tim.nguyen 2024/05/26: Must in format of JSONATA_SINGLE_KEY_EXPRESSION_REGEX
          result.push(`${path}.{ "${snake(key)}": ${key} }[]`);
        }
      });
    }

    // tim.nguyen 2024/05/26: Use `Set` to remove duplicate elements
    return [...new Set(result)];
  }

  function generateCompleteExpressions(singleKeyExpressions: Array<string>) {
    const fullExpression: { [completePath: string]: Array<string> } = {};

    for (const expression of singleKeyExpressions) {
      const [_, prefix, path, singleKey] = expression.match(
        JSONATA_SINGLE_KEY_EXPRESSION_REGEX
      );
      const completePath = `${prefix}.${path}`;

      if (!fullExpression[completePath]) {
        fullExpression[completePath] = [singleKey];
      } else {
        fullExpression[completePath].push(singleKey);
      }
    }

    // tim.nguyen 2024/05/26: After all complex logic to generate an expression, perform clean here!
    // In future will try to reduce complex logic so that don't workaround by clean at here
    return Object.entries(fullExpression).map(([fullPath, singleKeyArray]) => {
      return `${fullPath}{${singleKeyArray.join(", ")}}[]`;
    });
  }

  function generateJsonataExpressions(json: object) {
    return generateCompleteExpressions(generateSingleKeyExpressions(json));
  }

  return {
    generateJsonataExpressions,
  };
};
