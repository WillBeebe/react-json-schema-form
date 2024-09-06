import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import GCPRegionsComponent from '../plugins/customComponents/GCPRegions';
import JsonSchemaForm from './../index';

const presets = [
  {
    name: 'Simple Form',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name', default: 'John Doe' },
        age: { type: 'number', title: 'Age' },
        email: { type: 'string', title: 'Email', format: 'email' },
        redis_version: {
          type: 'string',
          title: 'Redis Version',
          enum: ['REDIS_3_2', 'REDIS_4_0'],
          default: 'REDIS_3_2',
        },
      },
      required: ['name', 'email'],
    },
  },
  {
    name: 'GCP Region Selector',
    schema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          title: 'Project Name',
          description: 'Enter the name of your GCP project',
        },
        region: {
          type: 'string',
          title: 'GCP Region',
          description: 'Select a GCP region for your resources',
          'x-component': 'GCPRegions',
        },
        description: {
          type: 'string',
          title: 'Description',
          description: 'Provide a brief description of your project',
        },
      },
      required: ['projectName', 'region'],
    },
  },
  {
    name: 'GCS Bucket',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Bucket Name',
          description: 'The name of the storage bucket',
          pattern: '^[a-z0-9][-_.a-z0-9]*[a-z0-9]$',
          maxLength: 63,
        },
        location: {
          type: 'string',
          title: 'Location',
          description: 'The location of the bucket (region or multi-region)',
          enum: [
            'US',
            'EU',
            'ASIA',
            'us-central1',
            'us-east1',
            'us-west1',
            'us-east4',
            'europe-west1',
            'europe-west2',
            'asia-east1',
            'asia-northeast1',
          ],
        },
        storage_class: {
          type: 'string',
          title: 'Storage Class',
          description: 'The storage class of the bucket',
          enum: ['STANDARD', 'NEARLINE', 'COLDLINE', 'ARCHIVE'],
          default: 'STANDARD',
        },
        versioning: {
          type: 'boolean',
          title: 'Enable Versioning',
          description: 'Whether to enable versioning for the bucket',
          default: false,
        },
        lifecycle_rules: {
          type: 'array',
          title: 'Lifecycle Rules',
          description: 'List of lifecycle rules for the bucket',
          items: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['Delete', 'SetStorageClass'],
              },
              age: {
                type: 'integer',
                minimum: 0,
              },
              storage_class: {
                type: 'string',
                enum: ['NEARLINE', 'COLDLINE', 'ARCHIVE'],
              },
            },
          },
        },
        encryption: {
          type: 'object',
          title: 'Encryption',
          description: 'Encryption settings for the bucket',
          properties: {
            default_kms_key_name: {
              type: 'string',
              description:
                'The Cloud KMS key name to use for the default encryption',
            },
          },
        },
        uniform_bucket_level_access: {
          type: 'boolean',
          title: 'Uniform Bucket-Level Access',
          description: 'Whether to enable uniform bucket-level access',
          default: true,
        },
        public_access_prevention: {
          type: 'string',
          title: 'Public Access Prevention',
          description: 'The public access prevention setting',
          enum: ['inherited', 'enforced'],
          default: 'inherited',
        },
      },
      required: ['name', 'location'],
    },
  },

  {
    name: 'Cloud SQL Instance',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Instance Name',
          description: 'The name of the Cloud SQL instance',
          pattern: '^[a-z][a-z0-9-]+[a-z0-9]$',
          maxLength: 63,
        },
        database_version: {
          type: 'string',
          title: 'MySQL Version',
          description: 'The MySQL version to use',
          enum: ['MYSQL_5_6', 'MYSQL_5_7', 'MYSQL_8_0'],
          default: 'MYSQL_8_0',
        },
        region: {
          type: 'string',
          title: 'Region',
          description: 'The GCP region where the instance will be created',
          pattern: '^[a-z]+-[a-z]+[0-9]$',
        },
        tier: {
          type: 'string',
          title: 'Machine Type',
          description:
            'The machine type to use, in the form db-custom-CPUS-MEMORY',
          pattern: '^db-custom-[1-9][0-9]?-[0-9]+$',
          default: 'db-custom-1-3840',
        },
        storage_type: {
          type: 'string',
          title: 'Storage Type',
          description: 'The storage type for the instance',
          enum: ['PD_SSD', 'PD_HDD'],
          default: 'PD_SSD',
        },
        storage_size_gb: {
          type: 'integer',
          title: 'Storage Size (GB)',
          description: 'The size of the storage in GB',
          minimum: 10,
          maximum: 65536,
        },
        availability_type: {
          type: 'string',
          title: 'Availability Type',
          description: 'The availability type of the instance',
          enum: ['ZONAL', 'REGIONAL'],
          default: 'ZONAL',
        },
        backup_enabled: {
          type: 'boolean',
          title: 'Enable Backups',
          description: 'Whether to enable automated backups',
          default: true,
        },
        backup_start_time: {
          type: 'string',
          title: 'Backup Start Time',
          description: 'The start time of the backup window in UTC (HH:MM)',
          pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
          default: '02:00',
        },
        enable_binary_log: {
          type: 'boolean',
          title: 'Enable Binary Logging',
          description: 'Whether to enable binary logging for replication',
          default: true,
        },
      },
      required: ['name', 'region', 'tier', 'storage_size_gb'],
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

  const [openDialog, setOpenDialog] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = useCallback((formName, data) => {
    setSubmittedData({ formName, data });
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const customComponents = {
    GCPRegions: GCPRegionsComponent,
  };

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
                customComponents={customComponents}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Submitted Form Data</DialogTitle>
        <DialogContent>
          {submittedData && (
            <>
              <Typography variant="h6">{submittedData.formName}</Typography>
              <pre>{JSON.stringify(submittedData.data, null, 2)}</pre>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FormVisualizer;
