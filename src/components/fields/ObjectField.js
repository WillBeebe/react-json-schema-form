import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import FormField from '../FormField';

const ObjectField = ({
  name,
  schema,
  value,
  onChange,
  onBlur,
  error,
  touched,
  customComponents,
}) => {
  const handleFieldChange = useCallback(
    (fieldName, fieldValue) => {
      onChange(name, { ...value, [fieldName]: fieldValue });
    },
    [name, value, onChange]
  );

  const handleFieldBlur = useCallback(
    (fieldName) => {
      onBlur(`${name}.${fieldName}`);
    },
    [name, onBlur]
  );

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${name}-content`}
        id={`${name}-header`}
      >
        <Typography variant="subtitle1">{schema.title || name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ pl: 2 }}>
          {Object.entries(schema.properties).map(([fieldName, fieldSchema]) => (
            <FormField
              key={fieldName}
              name={`${name}.${fieldName}`}
              schema={fieldSchema}
              value={(value || {})[fieldName]}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              error={error && error[fieldName]}
              touched={touched && touched[fieldName]}
              customComponents={customComponents}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

ObjectField.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.object,
  touched: PropTypes.object,
  customComponents: PropTypes.object,
};

export default React.memo(ObjectField);
