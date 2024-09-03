import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus,
  vs,
  atomDark,
  dracula,
  // docco
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Paper,
  Tooltip,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const themes = {
  vscDarkPlus,
  vs,
  atomDark,
  dracula,
  // docco,
};

const themeBackgrounds = {
  vscDarkPlus: '#1E1E1E',
  vs: '#FFFFFF',
  atomDark: '#282C34',
  dracula: '#282A36',
  docco: '#f8f8ff',
};

const RichCodeEditor = ({
  label,
  value,
  onChange,
  error,
  helperText,
  language = 'javascript',
}) => {
  const [code, setCode] = useState(value || '');
  const [theme, setTheme] = useState('vscDarkPlus');
  const [lintErrors, setLintErrors] = useState([]);

  useEffect(() => {
    onChange(code);
    if (language === 'javascript') {
      lintJavaScript(code);
    }
  }, [code, onChange, language]);

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const lintJavaScript = (code) => {
    const errors = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('var ')) {
        errors.push({
          line: index + 1,
          message: "Prefer 'let' or 'const' over 'var'",
        });
      }
      if (line.includes('==') || line.includes('!=')) {
        errors.push({
          line: index + 1,
          message: 'Use strict equality (=== or !==)',
        });
      }
      if (line.trim().endsWith(';') && !line.trim().startsWith('for')) {
        errors.push({ line: index + 1, message: 'Unnecessary semicolon' });
      }
    });

    setLintErrors(errors);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Theme</InputLabel>
        <Select value={theme} onChange={handleThemeChange} label="Theme">
          {Object.keys(themes).map((themeName) => (
            <MenuItem key={themeName} value={themeName}>
              {themeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Paper
        elevation={3}
        sx={{
          mb: 2,
          position: 'relative',
          backgroundColor: themeBackgrounds[theme],
          color: theme === 'vs' || theme === 'docco' ? '#000000' : '#FFFFFF',
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={code}
            onChange={handleCodeChange}
            error={error}
            helperText={error ? helperText : ''}
            sx={{
              fontFamily: 'monospace',
              caretColor: 'auto',
              '& .MuiInputBase-input': {
                color: 'transparent',
                caretColor:
                  theme === 'vs' || theme === 'docco' ? '#000000' : '#FFFFFF',
                lineHeight: '1.5em',
                padding: '1em !important',
                overflow: 'auto',
                '&::selection': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            InputProps={{
              sx: {
                overflow: 'auto',
                maxHeight: '400px', // Adjust this value as needed
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
              '& pre': {
                margin: 0,
                padding: '1em !important',
                fontFamily: 'inherit !important',
                fontSize: 'inherit !important',
                overflow: 'visible !important',
                whiteSpace: 'pre-wrap !important',
                wordBreak: 'keep-all',
              },
            }}
          >
            <SyntaxHighlighter
              language={language}
              style={themes[theme]}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber) => ({
                style: {
                  display: 'block',
                  position: 'relative',
                  paddingRight: '0.5em',
                },
              })}
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'none',
              }}
              lineNumberStyle={{
                paddingRight: '1em',
                opacity: 0.5,
              }}
              renderLine={(lineNumber, line) => (
                <span key={lineNumber} style={{ position: 'relative' }}>
                  {lintErrors.some((error) => error.line === lineNumber) && (
                    <Tooltip
                      title={
                        lintErrors.find((error) => error.line === lineNumber)
                          .message
                      }
                      placement="left"
                    >
                      <ErrorOutlineIcon
                        color="error"
                        sx={{
                          position: 'absolute',
                          right: '0.5em',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.8em',
                        }}
                      />
                    </Tooltip>
                  )}
                  {line}
                </span>
              )}
            >
              {code}
            </SyntaxHighlighter>
          </Box>
        </Box>
      </Paper>
      {lintErrors.length > 0 && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {lintErrors.length} lint error(s) found. Hover over the icons for
          details.
        </Typography>
      )}
      <Button variant="contained" onClick={() => console.log(code)}>
        Log Code to Console
      </Button>
    </Box>
  );
};

export default RichCodeEditor;
