import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './components/BaseNode';
import { NodeField, NodeInput } from './components/NodeField';

export const NumberNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const value = data?.value ?? '0';

  return (
    <BaseNode
      title="Number"
      subtitle={id}
      handles={[
        { id: `${id}-out`, type: 'source', position: Position.Right, top: 44, color: '#60a5fa' },
      ]}
    >
      <NodeField label="Value">
        <NodeInput value={value} onChange={(e) => updateNodeField(id, 'value', e.target.value)} />
      </NodeField>
    </BaseNode>
  );
};

