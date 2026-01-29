import Joi from "joi";

const DISABLE = (process.env.DISABLE_SERVER_VALIDATION || "false").toLowerCase() === "true";

export function validateOrBypass(schema, body, options = { abortEarly: false, stripUnknown: true }) {
  if (DISABLE) {
    return { error: null, value: body };
  }

  // If schema is not a Joi schema, just return body
  if (!schema || !schema.validate) {
    return { error: null, value: body };
  }

  return schema.validate(body, options);
}

export default validateOrBypass;
