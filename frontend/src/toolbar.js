// toolbar.js


import { DraggableNode } from './draggableNode';
const nodes = [
  { type: 'customInput', label: 'Input' },
  { type: 'llm', label: 'LLM' },
  { type: 'customOutput', label: 'Output' },
  { type: 'text', label: 'Text' },
  { type: 'number', label: 'Number' },
  { type: 'concat', label: 'Concat' },
  { type: 'if', label: 'If' },
  { type: 'uppercase', label: 'Uppercase' },
  { type: 'jsonParse', label: 'JSON Parse' },
];

export const PipelineToolbar = () => {
  return (
    <div className="vs-toolbar">
      <div className="vs-toolbar__label">Drag nodes to canvas</div>
      <div className="vs-toolbar__grid">
        {nodes.map((n) => (
          <DraggableNode key={n.type} type={n.type} label={n.label} />
        ))}
      </div>
    </div>
  );
};
