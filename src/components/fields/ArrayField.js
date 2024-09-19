import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  createDefaultValue,
  createGetItemSchema,
} from '../../utils/schemaUtils';
import FormField from '../FormField';

const ArrayField = ({ name, schema, value, onChange, error }) => {
  const [expanded, setExpanded] = useState(null);
  const arrayValue = useMemo(
    () => (Array.isArray(value) ? value : []),
    [value]
  );
  const getItemSchema = useMemo(() => createGetItemSchema(schema), [schema]);

  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;

  const handleExpand = useCallback(
    (index) => (event, isExpanded) => {
      setExpanded(isExpanded ? index : false);
    },
    []
  );

  const handleItemChange = useCallback(
    (index, newValue) => {
      console.log('handleItemChange called with:', index, newValue);
      const newArrayValue = [...arrayValue];
      newArrayValue[index] = newValue;
      onChange(name, newArrayValue);
    },
    [arrayValue, onChange, name]
  );

  const handleAdd = useCallback(() => {
    console.log('handleAdd called');
    const newItemSchema = getItemSchema(arrayValue.length);
    const newItem = createDefaultValue(newItemSchema);
    onChange(name, [...arrayValue, newItem]);
  }, [arrayValue, getItemSchema, onChange, name]);

  const handleRemove = useCallback(
    (index) => {
      console.log('Removing item at index:', index);
      console.log('Current array value:', arrayValue);
      const newArrayValue = arrayValue.filter((_, i) => i !== index);
      console.log('New array value:', newArrayValue);
      onChange(name, newArrayValue);
    },
    [arrayValue, onChange, name]
  );

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      console.log('onDragEnd called with:', result);
      const items = Array.from(arrayValue);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      onChange(name, items);
    },
    [arrayValue, onChange, name]
  );

  const getItemTitle = useCallback(
    (item, index) => {
      const itemSchema = getItemSchema(index);
      return itemSchema.title || `Item ${index + 1}`;
    },
    [getItemSchema]
  );

  const renderArrayItem = useCallback(
    (item, index) => {
      const itemSchema = getItemSchema(index);
      return (
        <FormField
          name={`${name}[${index}]`}
          schema={itemSchema}
          value={item}
          onChange={(_, newValue) => {
            console.log('FormField onChange called with:', _, newValue);
            if (typeof handleItemChange !== 'function') {
              console.error(
                'handleItemChange is not a function:',
                handleItemChange
              );
              return;
            }
            handleItemChange(index, newValue);
          }}
          error={error && error[index]}
        />
      );
    },
    [getItemSchema, handleItemChange, name, error]
  );

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{ mb: 1, fontWeight: 'bold' }}
        id={`${fieldId}-label`}
      >
        {schema.title}
        {schema.description && (
          <Tooltip title={schema.description} arrow>
            <InfoIcon
              fontSize="small"
              sx={{ ml: 1, verticalAlign: 'middle' }}
            />
          </Tooltip>
        )}
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="array-items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {arrayValue.map((item, index) => (
                <Draggable
                  key={index}
                  draggableId={`item-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <Accordion
                        expanded={expanded === index}
                        onChange={handleExpand(index)}
                        sx={{ mb: 1 }}
                        id={`${fieldId}-item-${index}`}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`${fieldId}-item-${index}-content`}
                          id={`${fieldId}-item-${index}-header`}
                          sx={{
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center',
                            },
                          }}
                        >
                          <IconButton
                            size="small"
                            {...provided.dragHandleProps}
                            aria-label={`Drag ${getItemTitle(item, index)}`}
                          >
                            <DragIndicatorIcon />
                          </IconButton>
                          <Typography sx={{ ml: 1 }}>
                            {getItemTitle(item, index)}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          id={`${fieldId}-item-${index}-content`}
                        >
                          <Paper elevation={0} sx={{ p: 2 }}>
                            {renderArrayItem(item, index)}
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 2,
                              }}
                            >
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleRemove(index)}
                                aria-label={`Remove ${getItemTitle(
                                  item,
                                  index
                                )}`}
                              >
                                Remove
                              </Button>
                            </Box>
                          </Paper>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ mt: 1 }}
        aria-label={`Add ${schema.title}`}
      >
        Add {schema.title}
      </Button>
      {error && (
        <Typography color="error" sx={{ mt: 1 }} id={errorId}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(ArrayField);
