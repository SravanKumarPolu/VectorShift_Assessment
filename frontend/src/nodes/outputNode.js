import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './components/BaseNode';
import { NodeField, NodeInput } from './components/NodeField';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const name = data?.name ?? 'output';

  return (
    <BaseNode
      title="Output"
      subtitle={id}
      handles={[
        {
          id: `${id}-in`,
          type: 'target',
          position: Position.Left,
          top: 44,
          color: '#34d399',
        },
      ]}
    >
      <NodeField label="Name">
        <NodeInput
          value={name}
          onChange={(e) => updateNodeField(id, 'name', e.target.value)}
          placeholder="e.g. final_answer"
        />
      </NodeField>
    </BaseNode>
  );
};

