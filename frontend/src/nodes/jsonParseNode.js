import { Position } from 'reactflow';
import { BaseNode } from './components/BaseNode';

export const JsonParseNode = ({ id }) => {
  return (
    <BaseNode
      title="JSON Parse"
      subtitle={id}
      handles={[
        { id: `${id}-in`, type: 'target', position: Position.Left, top: 44, color: '#34d399' },
        { id: `${id}-out`, type: 'source', position: Position.Right, top: 44, color: '#60a5fa' },
      ]}
      width={250}
    >
      <div style={{ fontSize: 12, color: '#cbd5e1' }}>
        Parses a JSON string into a structured value.
      </div>
    </BaseNode>
  );
};

