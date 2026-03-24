import './baseNode.css';

export function NodeField({ label, children }) {
  return (
    <label className="vs-node__field">
      <div className="vs-node__fieldLabel">{label}</div>
      <div className="vs-node__fieldControl">{children}</div>
    </label>
  );
}

export function NodeInput(props) {
  return <input className="vs-node__input" {...props} />;
}

export function NodeSelect(props) {
  return <select className="vs-node__select" {...props} />;
}

