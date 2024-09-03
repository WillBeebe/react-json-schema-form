import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Arrow, Layer, Rect, Stage, Text } from 'react-konva';
import RadDialog from '../../RadDialog';

const StoryNode = ({ node, position, onSelect, isSelected }) => (
  <React.Fragment>
    <Rect
      x={position.x}
      y={position.y}
      width={150}
      height={75}
      fill={isSelected ? '#ffd700' : '#f0f0f0'}
      shadowBlur={5}
      cornerRadius={5}
    />
    <Text
      x={position.x + 5}
      y={position.y + 5}
      width={140}
      height={65}
      text={
        node.content.substring(0, 50) + (node.content.length > 50 ? '...' : '')
      }
      fontSize={12}
      wrap="word"
      align="center"
      verticalAlign="middle"
      onClick={() => onSelect(node.id)}
    />
  </React.Fragment>
);

const StoryConnection = ({ start, end }) => (
  <Arrow
    points={[start.x + 75, start.y + 75, end.x + 75, end.y]}
    stroke="#555"
    strokeWidth={2}
    fill="#555"
  />
);

const DynamicStoryGenerator = ({
  label,
  value,
  onChange,
  error,
  helperText,
}) => {
  const [story, setStory] = useState(
    value ? JSON.parse(value) : { nodes: [], connections: [] }
  );
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [newNodeContent, setNewNodeContent] = useState('');

  const updateStory = useCallback(
    (newStory) => {
      setStory(newStory);
      onChange(JSON.stringify(newStory));
    },
    [onChange]
  );

  const addNode = useCallback(() => {
    const newNode = {
      id: Date.now(),
      content: newNodeContent,
      x: Math.random() * 500,
      y: Math.random() * 300,
    };
    updateStory({
      ...story,
      nodes: [...story.nodes, newNode],
    });
    setNewNodeContent('');
    setNodeDialogOpen(false);
  }, [story, newNodeContent, updateStory]);

  const deleteNode = useCallback(
    (nodeId) => {
      updateStory({
        nodes: story.nodes.filter((node) => node.id !== nodeId),
        connections: story.connections.filter(
          (conn) => conn.from !== nodeId && conn.to !== nodeId
        ),
      });
      setSelectedNode(null);
    },
    [story, updateStory]
  );

  const addConnection = useCallback(() => {
    if (selectedNode && story.nodes.length > 1) {
      const availableNodes = story.nodes.filter(
        (node) => node.id !== selectedNode
      );
      const randomNode =
        availableNodes[Math.floor(Math.random() * availableNodes.length)];
      updateStory({
        ...story,
        connections: [
          ...story.connections,
          { from: selectedNode, to: randomNode.id },
        ],
      });
    }
  }, [selectedNode, story, updateStory]);

  const renderStory = useCallback(() => {
    return (
      <Stage width={600} height={400}>
        <Layer>
          {story.connections.map((conn, index) => {
            const startNode = story.nodes.find((node) => node.id === conn.from);
            const endNode = story.nodes.find((node) => node.id === conn.to);
            return (
              <StoryConnection key={index} start={startNode} end={endNode} />
            );
          })}
          {story.nodes.map((node) => (
            <StoryNode
              key={node.id}
              node={node}
              position={{ x: node.x, y: node.y }}
              onSelect={setSelectedNode}
              isSelected={selectedNode === node.id}
            />
          ))}
        </Layer>
      </Stage>
    );
  }, [story, selectedNode]);

  const generateStory = useCallback(() => {
    const generateNextNode = (currentNode) => {
      const connections = story.connections.filter(
        (conn) => conn.from === currentNode.id
      );
      if (connections.length === 0) return null;

      const randomConnection =
        connections[Math.floor(Math.random() * connections.length)];
      return story.nodes.find((node) => node.id === randomConnection.to);
    };

    let storyContent = [];
    let node = story.nodes[0];

    while (node) {
      storyContent.push(node.content);
      node = generateNextNode(node);
    }

    return storyContent.join('\n\n');
  }, [story]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        {renderStory()}
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" onClick={() => setNodeDialogOpen(true)}>
          Add Story Node
        </Button>
        <Button
          variant="contained"
          onClick={addConnection}
          disabled={!selectedNode}
        >
          Add Connection
        </Button>
        <Button
          variant="contained"
          onClick={() => deleteNode(selectedNode)}
          disabled={!selectedNode}
        >
          Delete Selected Node
        </Button>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => alert(generateStory())}
      >
        Generate Random Story
      </Button>
      <RadDialog open={nodeDialogOpen} onClose={() => setNodeDialogOpen(false)}>
        <DialogTitle>Add New Story Node</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Node Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newNodeContent}
            onChange={(e) => setNewNodeContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNodeDialogOpen(false)}>Cancel</Button>
          <Button onClick={addNode}>Add</Button>
        </DialogActions>
      </RadDialog>
    </Box>
  );
};

export default DynamicStoryGenerator;
