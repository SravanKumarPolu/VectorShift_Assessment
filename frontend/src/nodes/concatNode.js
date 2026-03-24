import { Position } from 'reactflow';
import { BaseNode } from './components/BaseNode';

export const ConcatNode = ({ id }) => {
  return (
    <BaseNode
      title="Concat"
      subtitle={id}
      handles={[
        { id: `${id}-a`, type: 'target', position: Position.Left, top: 34, color: '#34d399' },
        { id: `${id}-b`, type: 'target', position: Position.Left, top: 58, color: '#34d399' },
        { id: `${id}-out`, type: 'source', position: Position.Right, top: 46, color: '#a78bfa' },
      ]}
      width={240}
    >
      <div style={{ fontSize: 12, color: '#cbd5e1' }}>
        Joins two inputs into a single string.
      </div>
    </BaseNode>
  );
};

