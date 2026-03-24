import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './components/BaseNode';
import { NodeField, NodeInput } from './components/NodeField';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const text = data?.text ?? '{{input}}';

  return (
    <BaseNode
      title="Text"
      subtitle={id}
      handles={[
        {
          id: `${id}-out`,
          type: 'source',
          position: Position.Right,
          top: 44,
          color: '#a78bfa',
        },
      ]}
    >
      <NodeField label="Text">
        <NodeInput value={text} onChange={(e) => updateNodeField(id, 'text', e.target.value)} />
      </NodeField>
    </BaseNode>
  );
};
