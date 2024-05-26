import { snake } from "radash";

export const useGenerateJsonataExpression = () => {
  const jsonataSingleKeyExpressionRegex = /^(\$)(?:\.(.*))?{([^{}]+)}\[\]$/;

  function generateSingleKeyExpressions(json: object, prefix = "$") {
    const stack: Array<{ json: object; path: string }> = [
      { json, path: prefix }, // tim.nguyen 2024/05/26: First path is the prefix itself. Jsonata will return the original object
    ];
    const result: Array<string> = [];

    while (stack.length > 0) {
      const { json, path } = stack.pop()!;

      Object.entries(json).forEach(([key, value]) => {
        /**
         * BUG (1): When json is array type --> The algorithm will pushing all the array elements to --> Duplicate field
         *
         * Solution: Detect array element --> Not assign newPath
         */
        let newPath = "";
        if (key.match(/^[0-9]*$/)) {
          newPath = `${path}`;
        } else {
          newPath = `${path}.${key}`;
        }

        if (value && typeof value === "object") {
          stack.push({ json: value, path: newPath });
        } else {
          // tim.nguyen 2024/05/26: Must in format of jsonataSingleKeyExpressionRegex
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
        jsonataSingleKeyExpressionRegex
      );
      const completePath = `${prefix}.${path}`;

      if (!fullExpression[completePath]) {
        fullExpression[completePath] = [singleKey];
      } else {
        fullExpression[completePath].push(singleKey);
      }
    }

    return Object.entries(fullExpression).map(([fullPath, singleKeyArray]) => {
      console.log(fullPath, singleKeyArray);

      return `${fullPath}{${singleKeyArray.join(", ")}}[]`;
    });
  }

  function generateJsonataExpression(json: object) {
    return generateCompleteExpressions(generateSingleKeyExpressions(json));
  }

  return {
    generateJsonataExpression,
  };
};
