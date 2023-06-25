const toString = (value) =>
  value === null || value === undefined ? "" : value + "";

/**
 * Apply list of validators on prompt.
 * @param {string} fieldName Field name shown to user.
 * @param  {...(fieldName: string, value: any) => boolean | string} validators
 */
const validate = (fieldName, ...validators) => {
  return (value) => {
    return validators.reduce((result, v) => {
      return result === true ? v(fieldName, value) : result;
    }, true);
  };
};

/**
 * Validator functions for prompts.
 * Can be used in the `validate` function above.
 */
const is = {
  /**
   * Field is required.
   * @param {string} fieldName
   * @param {any} value
   */
  required: (fieldName, value) => {
    const input = toString(value);
    if (input.length === 0) {
      return `${fieldName} is required.`;
    }
    return true;
  },
  /**
   * Input is single word, no special chars or whitespace.
   * @param {string} fieldName
   * @param {any} value
   */
  singleWord: (fieldName, value) => {
    const input = toString(value);
    if (input.length > 0 && !input.match(/^\w+$/g)) {
      return `${fieldName} must be a single word.`;
    }
    return true;
  },
};

/**
 * Filter functions for prompts.
 */
const filter = {
  /**
   * Trim any whitespace.
   * @param {any} value
   */
  trim: (value) => toString(value).trim(),
};

/**
 * @param {string} path
 */
const pagePath = (path) => `./src/pages/{{pascalCase name}}/${path}`;

/**
 * @param {string} path
 */
const servicePath = (path) => `./src/services/${path}`;

/**
 * @param {string} path
 */
const constantPath = (path) => `./src/constants/${path}`;

/**
 * @param {string} path
 */
const slicePath = (path) => `./src/redux/slices/${path}`;

/**
 * @param {string} path
 */
const typePath = (path) => `./src/types/${path}`;

/**
 * @param {string} path
 */
const pageTemplatePath = (path) => `./.plop/pages/${path}`;

/**
 * @param {string} path
 */
const constantTemplatePath = (path) => `./.plop/constants/${path}`;

/**
 * @param {string} path
 */
const serviceTemplatePath = (path) => `./.plop/service/${path}`;

/**
 * @param {string} path
 */
const sliceTemplatePath = (path) => `./.plop/slice/${path}`;

/**
 * @param {string} path
 */
const typeTemplatePath = (path) => `./.plop/types/${path}`;

/**
 * Add command.
 * @param {string}
 * @returns {import('plop').AddActionConfig}
 */
const addPage = (file) => ({
  type: "add",
  path: pagePath(file.replace("Entity", "{{pascalCase name}}")),
  templateFile: `${pageTemplatePath(file)}.hbs`,
  template: "",
});

const addScss = (file) => ({
  type: "add",
  path: pagePath(file.replace("Entity", "{{snakeCase name}}")),
  templateFile: `${pageTemplatePath(file)}.hbs`,
  template: "",
});

const addConstant = (file) => ({
  type: "add",
  path: constantPath(file.replace("Entity", "{{snakeCase name}}")),
  templateFile: `${constantTemplatePath(file)}.hbs`,
  template: "",
});

const addService = (file) => ({
  type: "add",
  path: servicePath(file.replace("Entity", "{{snakeCase name}}")),
  templateFile: `${serviceTemplatePath(file)}.hbs`,
  template: "",
});

const addSlice = (file) => ({
  type: "add",
  path: slicePath(file.replace("Entity", "{{snakeCase name}}")),
  templateFile: `${sliceTemplatePath(file)}.hbs`,
  template: "",
});

const addType = (file) => ({
  type: "add",
  path: typePath(file.replace("Entity", "{{snakeCase name}}")),
  templateFile: `${typeTemplatePath(file)}.hbs`,
  template: "",
});

module.exports = {
  validate,
  is,
  filter,
  addPage,
  addScss,
  addConstant,
  addService,
  addSlice,
  addType,
};
