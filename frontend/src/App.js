import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import './app.css';

function App() {
  return (
    <div className='app-shell'>
      <header className='app-panel app-header'>
<h1 className='app-tittle'>VectorShift Pipeline Builder</h1>
<p className='app-subtittle'>Design and connect your workflow graph.</p>
      </header>
      <section className='app-panel app-toolbar' > <PipelineToolbar /></section>
     <main className='app-panel app-canvas'> <PipelineUI /></main>
     <footer className='app-panel app-footer'>
  <SubmitButton />
     </footer>
    
    </div>
  );
}

export default App;
