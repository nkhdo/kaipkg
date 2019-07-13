const getInputId = (schema, prefix = '') => `${prefix}-${schema.name}`;

export default getInputId;
