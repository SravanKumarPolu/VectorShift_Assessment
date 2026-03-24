import { Position } from 'reactflow';
import { BaseNode } from './components/BaseNode';

export const IfNode = ({ id }) => {
  return (
    <BaseNode
      title="If"
      subtitle={id}
      handles={[
        { id: `${id}-cond`, type: 'target', position: Position.Left, top: 28, color: '#fbbf24' },
        { id: `${id}-then`, type: 'target', position: Position.Left, top: 52, color: '#34d399' },
        { id: `${id}-else`, type: 'target', position: Position.Left, top: 76, color: '#34d399' },
        { id: `${id}-out`, type: 'source', position: Position.Right, top: 52, color: '#a78bfa' },
      ]}
      width={240}
    >
      <div style={{ fontSize: 12, color: '#cbd5e1' }}>
        Routes <b>then</b> vs <b>else</b> based on <b>cond</b>.
      </div>
    </BaseNode>
  );
};

