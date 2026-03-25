// submit.js
import { useStore } from './store';

export const SubmitButton = () => {
    const { nodes, edges } = useStore();

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8003/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nodes: nodes,
                    edges: edges
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Format the alert message
            const isDagText = data.is_dag ? 'Yes' : 'No';
            let message = `Pipeline Summary\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nIs DAG: ${isDagText}`;

            if (data.error) {
                message += `\n\nError: ${data.error}`;
            } else if (data.execution_result) {
                message += '\n\nExecution Results:';
                for (const [nodeId, result] of Object.entries(data.execution_result)) {
                    message += `\n${nodeId}: ${JSON.stringify(result)}`;
                }
            }

            alert(message);

        } catch (error) {
            alert(`Error submitting pipeline: ${error.message}`);
        }
    };

    return (
        <div className="vs-submit-wrap">
            <button className="vs-submit-btn" type="submit" onClick={handleSubmit}>
                Submit Pipeline
            </button>
        </div>
    );
}
