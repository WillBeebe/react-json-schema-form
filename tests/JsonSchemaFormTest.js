import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import yaml from 'js-yaml';
import React, { useRef, useState } from 'react';
import JsonSchemaForm, { GCPRegionsComponent } from './JsonSchemaForm';
import CIDRBlockSelector from './JsonSchemaForm/customComponents/CIDRBlockSelector';
import DynamicStoryGenerator from './JsonSchemaForm/customComponents/DynamicStoryGenerator';
import RichCodeEditor from './JsonSchemaForm/customComponents/RichCodeEditor';
import WeatherCityComponent from './JsonSchemaForm/customComponents/WeatherCity';

const JsonSchemaFormTest = () => {
  const [schema, setSchema] = useState({
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Project Name' },
      region: { type: 'string' },
      city: { type: 'string' },
      cidrBlock: {
        type: 'string',
        title: 'Network CIDR Block',
        pattern: '^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$',
      },
      // storyMap: {
      //   type: 'string',
      //   title: 'Interactive Story Map',
      // },
      code: {
        type: 'string',
        title: 'JavaScript Code',
      },
    },
  });
  const [initialData, setInitialData] = useState({ name: 'Hello world' });
  const [schemaInput, setSchemaInput] = useState('');
  const [dataInput, setDataInput] = useState('{}');
  const [schemaError, setSchemaError] = useState('');
  const [dataError, setDataError] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const formRef = useRef();

  const customComponents = {
    region: GCPRegionsComponent,
    city: WeatherCityComponent,
    cidrBlock: CIDRBlockSelector,
    code: RichCodeEditor,
    storyMap: DynamicStoryGenerator,
  };

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    setValidationResult(JSON.stringify(formData, null, 2));
  };

  const handleClose = () => {
    console.log('Form closed');
  };

  const handleSchemaInputChange = (event) => {
    setSchemaInput(event.target.value);
  };

  const handleDataInputChange = (event) => {
    setDataInput(event.target.value);
  };

  const handleApplySchema = () => {
    try {
      const parsedSchema = yaml.load(schemaInput);
      setSchema(parsedSchema);
      setSchemaError('');
    } catch (error) {
      setSchemaError('Error parsing YAML schema. Please check your syntax.');
    }
  };

  const handleApplyData = () => {
    try {
      const parsedData = JSON.parse(dataInput);
      setInitialData(parsedData);
      setDataError('');
    } catch (error) {
      setDataError('Error parsing JSON data. Please check your syntax.');
    }
  };

  const handleValidate = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const yamlTest = `
type: object
properties:
  name:
    type: string
    title: Name
  description:
    type: string
    title: Description
  privacy:
    type: string
    title: Privacy
    default: closed
    enum:
    - closed
    - secret
  `;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Input YAML Schema
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              value={schemaInput}
              onChange={handleSchemaInputChange}
              error={!!schemaError}
              helperText={schemaError}
              placeholder={yamlTest}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplySchema}
              sx={{ mt: 2 }}
            >
              Apply Schema
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Input JSON Initial Data
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              value={dataInput}
              onChange={handleDataInputChange}
              error={!!dataError}
              helperText={dataError}
              placeholder='{"name":"hello world"}'
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyData}
              sx={{ mt: 2 }}
            >
              Apply Data
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          JSON Schema Form
        </Typography>
        <JsonSchemaForm
          ref={formRef}
          schema={schema}
          initialData={initialData}
          onClose={handleClose}
          onSubmit={handleSubmit}
          customComponents={customComponents}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleValidate}
          sx={{ mt: 2 }}
        >
          Validate
        </Button>
      </Box>
      {validationResult && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Validation Result
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={validationResult}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default JsonSchemaFormTest;
