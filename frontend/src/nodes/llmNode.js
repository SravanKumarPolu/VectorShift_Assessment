import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './components/BaseNode';
import { NodeField, NodeInput, NodeSelect } from './components/NodeField';

export const LLMNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const model = data?.model ?? 'gpt-4.1-mini';
  const temperature = data?.temperature ?? '0.7';

  return (
    <BaseNode
      title="LLM"
      subtitle={id}
      handles={[
        { id: `${id}-system`, type: 'target', position: Position.Left, top: 34, color: '#fbbf24' },
        { id: `${id}-user`, type: 'target', position: Position.Left, top: 58, color: '#fbbf24' },
        { id: `${id}-out`, type: 'source', position: Position.Right, top: 46, color: '#f472b6' },
      ]}
      width={260}
    >
      <NodeField label="Model">
        <NodeSelect value={model} onChange={(e) => updateNodeField(id, 'model', e.target.value)}>
          <option value="gpt-4.1-mini">gpt-4.1-mini</option>
          <option value="gpt-4o-mini">gpt-4o-mini</option>
          <option value="gpt-4.1">gpt-4.1</option>
        </NodeSelect>
      </NodeField>

      <NodeField label="Temp">
        <NodeInput
          value={temperature}
          onChange={(e) => updateNodeField(id, 'temperature', e.target.value)}
          placeholder="0.0 - 2.0"
        />
      </NodeField>
    </BaseNode>
  );
};

