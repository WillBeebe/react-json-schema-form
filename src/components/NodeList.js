import React from 'react';
import CustomNode from '../CustomNode';

const NodeList = ({ nodes, onOperations }) => {
  return nodes.map((node) => (
    <CustomNode
      key={node.id}
      {...node}
      onOpenModal={() => onOperations('openModal', node)}
      onDeploy={() => onOperations('deploy', node)}
      onDelete={() => onOperations('delete', node)}
    />
  ));
};

export default NodeList;
