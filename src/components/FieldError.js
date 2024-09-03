import { Collapse, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.75rem',
  marginTop: theme.spacing(0.5),
  transition: theme.transitions.create('all', {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
}));

const FieldError = ({ error, touched }) => (
  <Collapse in={touched && !!error}>
    <ErrorText role="alert">{error}</ErrorText>
  </Collapse>
);

export default React.memo(FieldError);
