const {
  validate,
  is,
  filter,
  addPage,
  addConstant,
  addSlice,
  addService,
  addScss,
  addType,
} = require("./.plop/utils");

/**
 * @param {import('plop').NodePlopAPI} plop
 */
module.exports = function (plop) {
  plop.setGenerator("entity", {
    description: "Create an entity",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your entity name (e.g. BrandSetup)?",
        validate: validate("Entity name", is.required, is.singleWord),
      },
    ],
    actions: [
      addScss("_Entity.scss"),
      addPage("Entity.tsx"),
      addPage("index.ts"),
      addConstant("Entity-keys.ts"),
      addService("Entity-service.ts"),
      addSlice("Entity-slice.ts"),
      addType("Entity-props.ts"),
    ],
  });
};
