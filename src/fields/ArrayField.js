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
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import JsonSchemaForm from '../components/JsonSchemaForm';
import { createDefaultValue, createGetItemSchema } from '../utils/schemaUtils';

const ArrayField = ({ fieldSchema, value, onChange, error }) => {
  const [expanded, setExpanded] = useState(null);
  const arrayValue = useMemo(
    () => (Array.isArray(value) ? value : []),
    [value]
  );
  const getItemSchema = useMemo(
    () => createGetItemSchema(fieldSchema),
    [fieldSchema]
  );

  const handleAdd = useCallback(() => {
    const newItem = createDefaultValue(fieldSchema.items);
    onChange([...arrayValue, newItem]);
    setExpanded(arrayValue.length);
  }, [arrayValue, fieldSchema.items, onChange]);

  const handleRemove = useCallback(
    (index) => {
      const newValue = arrayValue.filter((_, i) => i !== index);
      onChange(newValue);
      setExpanded((prev) =>
        prev === index ? null : prev > index ? prev - 1 : prev
      );
    },
    [arrayValue, onChange]
  );

  const handleItemChange = useCallback(
    (index, itemValue) => {
      const newValue = [...arrayValue];
      newValue[index] = itemValue;
      onChange(newValue);
    },
    [arrayValue, onChange]
  );

  const handleExpand = useCallback(
    (index) => (_, isExpanded) => {
      setExpanded(isExpanded ? index : null);
    },
    []
  );

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const newItems = Array.from(arrayValue);
      const [reorderedItem] = newItems.splice(result.source.index, 1);
      newItems.splice(result.destination.index, 0, reorderedItem);
      onChange(newItems);
      setExpanded(result.destination.index);
    },
    [arrayValue, onChange]
  );

  const getItemTitle = useCallback(
    (item, index) => {
      if (item && item.name) {
        return `${fieldSchema.title} - ${item.name}`;
      }
      return `${fieldSchema.title} ${index + 1}`;
    },
    [fieldSchema.title]
  );

  const renderArrayItem = useCallback(
    (item, index) => {
      const itemSchema = getItemSchema(index);
      if (itemSchema.enum) {
        const options = itemSchema.enum.map((value, idx) => ({
          value,
          label: itemSchema.enumNames?.[idx] || value,
        }));

        return (
          <Select
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            fullWidth
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      }

      return (
        <JsonSchemaForm
          schema={itemSchema}
          initialData={item}
          onChange={(data) => handleItemChange(index, data)}
        />
      );
    },
    [getItemSchema, handleItemChange]
  );

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        {fieldSchema.title}
        {fieldSchema.description && (
          <Tooltip title={fieldSchema.description} arrow>
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
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center',
                            },
                          }}
                        >
                          <IconButton
                            size="small"
                            {...provided.dragHandleProps}
                          >
                            <DragIndicatorIcon />
                          </IconButton>
                          <Typography sx={{ ml: 1 }}>
                            {getItemTitle(item, index)}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
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
      >
        Add {fieldSchema.title}
      </Button>
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(ArrayField);
