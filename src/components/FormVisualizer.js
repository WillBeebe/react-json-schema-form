import { Container, Grid, Paper, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import JsonSchemaForm from './../index';

const presets = [
  {
    name: 'Simple Form',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
        age: { type: 'number', title: 'Age' },
        email: { type: 'string', title: 'Email', format: 'email' },
      },
      required: ['name', 'email'],
    },
  },
  {
    name: 'Complex Form',
    schema: {
      type: 'object',
      properties: {
        personal: {
          type: 'object',
          title: 'Personal Information',
          properties: {
            firstName: { type: 'string', title: 'First Name' },
            lastName: { type: 'string', title: 'Last Name' },
            dob: { type: 'string', title: 'Date of Birth', format: 'date' },
          },
          required: ['firstName', 'lastName'],
        },
        address: {
          type: 'object',
          title: 'Address',
          properties: {
            street: { type: 'string', title: 'Street' },
            city: { type: 'string', title: 'City' },
            zipCode: { type: 'string', title: 'Zip Code', pattern: '^d{5}$' },
          },
        },
        preferences: {
          type: 'array',
          title: 'Preferences',
          items: {
            type: 'string',
            enum: ['Sports', 'Music', 'Movies', 'Travel'],
          },
          uniqueItems: true,
        },
      },
    },
  },
  {
    name: 'Conditional Form',
    schema: {
      type: 'object',
      properties: {
        employmentStatus: {
          type: 'string',
          title: 'Employment Status',
          enum: ['Employed', 'Self-employed', 'Unemployed'],
        },
        companyName: {
          type: 'string',
          title: 'Company Name',
        },
        businessType: {
          type: 'string',
          title: 'Business Type',
        },
      },
      required: ['employmentStatus'],
      dependencies: {
        employmentStatus: {
          oneOf: [
            {
              properties: {
                employmentStatus: { enum: ['Employed'] },
                companyName: { type: 'string' },
              },
              required: ['companyName'],
            },
            {
              properties: {
                employmentStatus: { enum: ['Self-employed'] },
                businessType: { type: 'string' },
              },
              required: ['businessType'],
            },
            {
              properties: {
                employmentStatus: { enum: ['Unemployed'] },
              },
            },
          ],
        },
      },
    },
  },
];

const FormVisualizer = () => {
  const [formData, setFormData] = useState(
    presets.reduce((acc, preset) => ({ ...acc, [preset.name]: {} }), {})
  );

  const handleChange = useCallback((formName, newData) => {
    setFormData((prevData) => ({
      ...prevData,
      [formName]: newData,
    }));
  }, []);

  const handleSubmit = useCallback((formName, data) => {
    console.log(formName, 'submitted:', data);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        JSON Schema Form Visualizer
      </Typography>
      <Grid container spacing={3}>
        {presets.map((preset, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {preset.name}
              </Typography>
              <JsonSchemaForm
                schema={preset.schema}
                initialData={formData[preset.name]}
                onChange={(newData) => handleChange(preset.name, newData)}
                onSubmit={(data) => handleSubmit(preset.name, data)}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FormVisualizer;
