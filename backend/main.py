from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import deque
from typing import List, Dict, Any, Optional
import json
import re

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced Pydantic models
class NodeData(BaseModel):
    name: Optional[str] = None
    text: Optional[str] = None
    inputType: Optional[str] = None
    model: Optional[str] = None
    temperature: Optional[str] = None

class Node(BaseModel):
    id: str
    type: str
    data: Optional[NodeData] = None

class Edge(BaseModel):
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
    execution_result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

# Node execution functions
def execute_input_node(node: Node) -> Any:
    """Execute an input node - returns the configured value"""
    data = node.data or NodeData()
    input_type = data.inputType or 'text'
    name = data.name or 'input'

    # For now, return default values since we don't have actual user input
    if input_type == 'number':
        return 0
    elif input_type == 'json':
        return {}
    else:
        return f"sample_{name}"

def execute_text_node(node: Node, inputs: Dict[str, Any]) -> str:
    """Execute a text node - substitute variables with inputs"""
    data = node.data or NodeData()
    text = data.text or ''

    # Simple string replacement for variables
    for var, value in inputs.items():
        text = text.replace('{{' + var + '}}', str(value))
        text = text.replace('{{ ' + var + ' }}', str(value))
        text = text.replace('{{ ' + var + '}}', str(value))
        text = text.replace('{{' + var + ' }}', str(value))

    return text

def execute_llm_node(node: Node, inputs: Dict[str, Any]) -> str:
    """Execute an LLM node - simulate LLM call"""
    data = node.data or NodeData()
    model = data.model or 'gpt-4.1-mini'

    # Get system and user prompts from inputs
    system_prompt = inputs.get('system', '')
    user_prompt = inputs.get('user', '')

    # Simulate LLM response
    return f"[LLM {model}] System: {system_prompt}, User: {user_prompt} -> Generated response"

def execute_number_node(node: Node) -> float:
    """Execute a number node - return configured number"""
    # For now, return a default number since we don't have input
    return 42.0

def execute_concat_node(node: Node, inputs: Dict[str, Any]) -> str:
    """Execute a concat node - join all inputs"""
    values = [str(v) for v in inputs.values()]
    return ''.join(values)

def execute_if_node(node: Node, inputs: Dict[str, Any]) -> Any:
    """Execute an if node - route based on condition"""
    # For now, just return the first available input
    for value in inputs.values():
        return value
    return None

def execute_uppercase_node(node: Node, inputs: Dict[str, Any]) -> str:
    """Execute an uppercase node"""
    for value in inputs.values():
        return str(value).upper()
    return ''

def execute_json_parse_node(node: Node, inputs: Dict[str, Any]) -> Any:
    """Execute a JSON parse node"""
    for value in inputs.values():
        try:
            return json.loads(str(value))
        except:
            return {"error": "Invalid JSON"}
    return {}

def execute_output_node(node: Node, inputs: Dict[str, Any]) -> Any:
    """Execute an output node - just return the input"""
    for value in inputs.values():
        return value
    return None

# Node execution mapping
NODE_EXECUTORS = {
    'input': execute_input_node,
    'customInput': execute_input_node,
    'text': execute_text_node,
    'llm': execute_llm_node,
    'number': execute_number_node,
    'concat': execute_concat_node,
    'if': execute_if_node,
    'uppercase': execute_uppercase_node,
    'jsonParse': execute_json_parse_node,
    'output': execute_output_node,
    'customOutput': execute_output_node,
}

def execute_pipeline(nodes: List[Node], edges: List[Edge]) -> Dict[str, Any]:
    """Execute the pipeline in topological order"""
    # Build graph and in-degree
    graph = {node.id: [] for node in nodes}
    in_degree = {node.id: 0 for node in nodes}
    node_map = {node.id: node for node in nodes}

    # Build handle-to-handle connections
    handle_connections = {}  # target_handle -> (source_node_id, output_value)

    for edge in edges:
        if edge.source in graph and edge.target in graph:
            graph[edge.source].append(edge.target)
            in_degree[edge.target] += 1

    # Topological sort
    queue = deque([node_id for node_id in in_degree if in_degree[node_id] == 0])
    execution_order = []
    node_outputs = {}  # node_id -> output_value

    while queue:
        current_node_id = queue.popleft()
        execution_order.append(current_node_id)

        current_node = node_map[current_node_id]
        executor = NODE_EXECUTORS.get(current_node.type)

        if not executor:
            continue

        # Collect inputs for this node
        inputs = {}
        for edge in edges:
            if edge.target == current_node_id:
                source_node_id = edge.source
                if source_node_id in node_outputs:
                    # Determine which input this connects to based on target handle
                    input_key = 'input'  # default
                    if edge.targetHandle:
                        if 'system' in edge.targetHandle:
                            input_key = 'system'
                        elif 'user' in edge.targetHandle:
                            input_key = 'user'
                        elif '-in-' in edge.targetHandle:
                            # Extract variable name from handle ID
                            parts = edge.targetHandle.split('-in-')
                            if len(parts) > 1:
                                input_key = parts[1].split('-')[0]  # Get variable name

                    inputs[input_key] = node_outputs[source_node_id]

        # Execute the node
        try:
            if current_node.type in ['input', 'customInput', 'number']:
                # Nodes without inputs
                output = executor(current_node)
            else:
                # Nodes with inputs
                output = executor(current_node, inputs)

            node_outputs[current_node_id] = output
        except Exception as e:
            node_outputs[current_node_id] = f"Error: {str(e)}"

        # Update in-degrees
        for neighbor in graph[current_node_id]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # Collect outputs from output nodes
    execution_result = {}
    for node in nodes:
        if node.type in ['output', 'customOutput']:
            execution_result[node.id] = node_outputs.get(node.id, None)

    return execution_result

@app.post('/pipelines/parse')
def parse_pipeline(request: PipelineRequest) -> PipelineResponse:
    num_nodes = len(request.nodes)
    num_edges = len(request.edges)

    # Build graph adjacency list and in-degree map
    graph = {node.id: [] for node in request.nodes}
    in_degree = {node.id: 0 for node in request.nodes}

    # Populate graph from edges
    for edge in request.edges:
        if edge.source in graph and edge.target in graph:
            graph[edge.source].append(edge.target)
            in_degree[edge.target] += 1

    # Kahn's algorithm for topological sort (DAG detection)
    queue = deque([node_id for node_id in in_degree if in_degree[node_id] == 0])
    visited_count = 0

    while queue:
        current = queue.popleft()
        visited_count += 1
        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If all nodes were visited, it's a DAG
    is_dag = visited_count == num_nodes

    execution_result = None
    error = None

    if is_dag:
        try:
            execution_result = execute_pipeline(request.nodes, request.edges)
        except Exception as e:
            error = f"Execution error: {str(e)}"
    else:
        error = "Cannot execute: Graph contains cycles"

    return PipelineResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=is_dag,
        execution_result=execution_result,
        error=error
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
