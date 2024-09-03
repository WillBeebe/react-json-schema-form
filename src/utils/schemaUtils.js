export const createGetItemSchema = (fieldSchema) => {
  if (Array.isArray(fieldSchema.items)) {
    // Handle tuple validation
    return (index) =>
      fieldSchema.items[index] || fieldSchema.additionalItems || {};
  }
  // Handle list validation
  return () => fieldSchema.items || {};
};

export const createDefaultValue = (schema) => {
  if (!schema) return null;

  switch (schema.type) {
    case 'string':
      return schema.default || '';
    case 'number':
    case 'integer':
      return schema.default || 0;
    case 'boolean':
      return schema.default || false;
    case 'array':
      return schema.default || [];
    case 'object':
      if (schema.properties) {
        return Object.keys(schema.properties).reduce((acc, key) => {
          acc[key] = createDefaultValue(schema.properties[key]);
          return acc;
        }, {});
      }
      return schema.default || {};
    default:
      return schema.default || null;
  }
};
