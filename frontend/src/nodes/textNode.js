import { useEffect, useMemo, useRef, useState } from 'react';
import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './components/BaseNode';
import { NodeField, NodeInput } from './components/NodeField';

const variableRegex = /{{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*}}/g;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function parseVariables(rawText = '') {
  const set = new Set();
  let match;
  while ((match = variableRegex.exec(rawText)) !== null) {
    set.add(match[1]);
  }
  return [...set];
}

function useParsedVariables(text) {
  return useMemo(() => parseVariables(text), [text]);
}

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const initialText = data?.text ?? '{{input}}';
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const variables = useParsedVariables(text);
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(Math.max(40, ta.scrollHeight), 220)}px`;
  }, [text]);

  const nodeWidth = useMemo(() => {
    const base = 220;
    const extra = Math.min(240, text.length * 0.4);
    return clamp(base + extra, 240, 560);
  }, [text]);

  const variableHandles = variables.map((name, index) => ({
    id: `${id}-in-${name}-${index}`,
    type: 'target',
    position: Position.Left,
    top: 28 + index * 22,
    color: '#fbbf24',
  }));

  const outputHandle = {
    id: `${id}-out`,
    type: 'source',
    position: Position.Right,
    top: 44,
    color: '#a78bfa',
  };

  const onTextChange = (e) => {
    const next = e.target.value;
    setText(next);
    updateNodeField(id, 'text', next);
  };

  return (
    <BaseNode title="Text" subtitle={id} width={nodeWidth} handles={[...variableHandles, outputHandle]}>
      <NodeField label="Text">
        <textarea
          ref={textareaRef}
          className="vs-node__input"
          value={text}
          onChange={onTextChange}
          style={{
            width: '100%',
            minHeight: 40,
            overflow: 'hidden',
            resize: 'none',
          }}
        />
      </NodeField>

      {variables.length > 0 && (
        <div style={{ color: '#facc15', fontSize: 12, marginTop: 6, lineHeight: 1.4 }}>
          Detected variables:{' '}
          {variables.map((name) => (
            <span key={name} style={{ marginRight: 8 }}>
              <strong>{name}</strong>
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};