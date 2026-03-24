import { Position } from 'reactflow';
import { BaseNode } from './components/BaseNode';

export const UppercaseNode = ({ id }) => {
  return (
    <BaseNode
      title="Uppercase"
      subtitle={id}
      handles={[
        { id: `${id}-in`, type: 'target', position: Position.Left, top: 44, color: '#34d399' },
        { id: `${id}-out`, type: 'source', position: Position.Right, top: 44, color: '#a78bfa' },
      ]}
    >
      <div style={{ fontSize: 12, color: '#cbd5e1' }}>Converts input text to UPPERCASE.</div>
    </BaseNode>
  );
};

