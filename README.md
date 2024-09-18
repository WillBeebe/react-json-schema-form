# react-jsonschema-form

This thing was a beast to wrangle and only gets better the more time that's spent on it. In my mind, that's exactly when you break it out into it's own component.


```jsx
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
	
	<JsonSchemaForm
		schema={schema}
		uiSchema={uiSchema}
		onSubmit={handleSubmit}
		hideSubmitButton={true}
	/>
};
```
