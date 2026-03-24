import { Handle } from 'reactflow';
import './baseNode.css';

const positionToStyle = {
  left: { left: -8 },
  right: { right: -8 },
  top: { top: -8 },
  bottom: { bottom: -8 },
};

export function BaseNode({
  title,
  subtitle,
  handles = [],
  children,
  width = 240,
}) {
  return (
    <div className="vs-node" style={{ width }}>
      <div className="vs-node__header">
        <div className="vs-node__title">{title}</div>
        {subtitle ? <div className="vs-node__subtitle">{subtitle}</div> : null}
      </div>

      <div className="vs-node__body">{children}</div>

      {handles.map((h) => (
        <Handle
          key={h.key || h.id}
          type={h.type}
          position={h.position}
          id={h.id}
          className="vs-node__handle"
          style={{
            ...(positionToStyle[h.position] || {}),
            top: typeof h.top === 'number' ? h.top : undefined,
            background: h.color || undefined,
          }}
        />
      ))}
    </div>
  );
}

