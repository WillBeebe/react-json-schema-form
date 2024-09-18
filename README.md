# react-jsonschema-form

A complicated but powerful React component. 

Fields and validation are purely driven via JSONSchema. 

Support for Custom UI components, on top of Schema.


```jsx
import React, { useCallback } from 'react';
import JsonSchemaForm from 'react-json-schema-form';

const CreateProjectModal = ({ onSubmit }) => {
	const schema = {
		type: 'object',
		properties: {
			name: {
				type: 'string',
				title: 'Name',
				minLength: 1,
			},
		},
		required: ['name'],
	};
	
	const uiSchema = {
		name: {
			'ui:autofocus': true,
			'ui:placeholder': 'Project Name',
		},
	};
	
	const handleSubmit = useCallback(
		async (formData) => {
			await onSubmit(formData);
			onClose();
		}, [onSubmit, onClose]
	);

	return (
		<JsonSchemaForm
			schema={schema}
			uiSchema={uiSchema}
			onSubmit={handleSubmit}
			hideSubmitButton={true}
		/>);
};
```
