import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import FieldRenderer from '../FieldRenderer';

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
  const { title, description, properties } = schema;
  const isRequired = schema.required && schema.required.includes(name);
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;

  const handleChange = (fieldName, fieldValue) => {
    onChange(name, { ...value, [fieldName]: fieldValue });
  };

  const handleBlur = (fieldName) => {
    onBlur(`${name}.${fieldName}`);
  };

  return (
    <Accordion defaultExpanded id={fieldId}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${fieldId}-content`}
        id={`${fieldId}-header`}
      >
        <Typography>
          {title || name}
          {isRequired && <span style={{ color: 'red' }}> *</span>}
          {description && (
            <Tooltip title={description} arrow>
              <InfoIcon
                fontSize="small"
                sx={{ ml: 1, verticalAlign: 'middle' }}
              />
            </Tooltip>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails id={`${fieldId}-content`}>
        <Box sx={{ pl: 2 }}>
          {Object.entries(properties).map(([fieldName, fieldSchema]) => (
            <FieldRenderer
              key={fieldName}
              name={fieldName}
              schema={fieldSchema}
              value={(value || {})[fieldName]}
              onChange={handleChange}
              onBlur={handleBlur}
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

export default React.memo(ObjectField);
