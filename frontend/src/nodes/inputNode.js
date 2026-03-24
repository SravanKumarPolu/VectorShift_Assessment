import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './components/BaseNode';
import { NodeField, NodeInput, NodeSelect } from './components/NodeField';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const name = data?.name ?? 'input';
  const inputType = data?.inputType ?? 'text';

  return (
    <BaseNode
      title="Input"
      subtitle={id}
      handles={[
        {
          id: `${id}-out`,
          type: 'source',
          position: Position.Right,
          top: 44,
          color: '#60a5fa',
        },
      ]}
    >
      <NodeField label="Name">
        <NodeInput
          value={name}
          onChange={(e) => updateNodeField(id, 'name', e.target.value)}
          placeholder="e.g. user_query"
        />
      </NodeField>

      <NodeField label="Type">
        <NodeSelect
          value={inputType}
          onChange={(e) => updateNodeField(id, 'inputType', e.target.value)}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="json">JSON</option>
        </NodeSelect>
      </NodeField>
    </BaseNode>
  );
};

