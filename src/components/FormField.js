import React from 'react';
import FieldError from './FieldError';
import ArrayField from './fields/ArrayField';
import BooleanField from './fields/BooleanField';
import EnumField from './fields/EnumField';
import NumberField from './fields/NumberField';
import ObjectField from './fields/ObjectField';
import StringField from './fields/StringField';

const FormField = ({
  name,
  schema,
  value,
  onChange,
  onBlur,
  error,
  touched,
  customComponents,
}) => {
  const commonProps = {
    name,
    schema,
    value,
    onChange,
    onBlur,
    error,
    touched,
    customComponents,
  };

  let FieldComponent;
  switch (schema.type) {
    case 'string':
      FieldComponent = schema.enum ? EnumField : StringField;
      break;
    case 'number':
    case 'integer':
      FieldComponent = NumberField;
      break;
    case 'boolean':
      FieldComponent = BooleanField;
      break;
    case 'array':
      FieldComponent = ArrayField;
      break;
    case 'object':
      FieldComponent = ObjectField;
      break;
    default:
      return <div>Unsupported field type: {schema.type}</div>;
  }

  const CustomComponent = customComponents[name];
  const ComponentToRender = CustomComponent || FieldComponent;

  return (
    <>
      <ComponentToRender {...commonProps} />
      <FieldError error={error} touched={touched} />
    </>
  );
};

export default React.memo(FormField);
