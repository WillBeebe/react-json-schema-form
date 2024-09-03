import React from 'react';
import { useErrors } from '../context/ErrorContext';
import { pluginRegistry } from '../plugins/PluginRegistry';
import ArrayField from './fields/ArrayField';
import BooleanField from './fields/BooleanField';
import NumberField from './fields/NumberField';
import ObjectField from './fields/ObjectField';
import StringField from './fields/StringField';

const FieldRenderer = ({ name, schema, value, onChange, onBlur }) => {
  // TODO: Implement conditional rendering based on other field values
  // This can be done by adding a `conditions` property to the schema
  // and evaluating it here before rendering the field.

  // TODO:
  const { errors } = useErrors();
  const error = errors[name];

  const plugin = pluginRegistry.getPlugin(schema);

  if (plugin) {
    const PluginComponent = plugin.component;
    return (
      <PluginComponent
        name={name}
        schema={schema}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        // error={error}
      />
    );
  }

  const commonProps = {
    name,
    schema,
    value,
    onChange,
    onBlur,
    // error,
  };

  switch (schema.type) {
    case 'string':
      return <StringField {...commonProps} />;
    case 'number':
    case 'integer':
      return <NumberField {...commonProps} />;
    case 'boolean':
      return <BooleanField {...commonProps} />;
    case 'array':
      return <ArrayField {...commonProps} />;
    case 'object':
      return <ObjectField {...commonProps} />;
    default:
      return <div>Unsupported field type: {schema.type}</div>;
  }
};

export default React.memo(FieldRenderer);
