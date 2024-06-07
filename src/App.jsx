import './App.css'
import { GameChart } from './gameChart'

function App() {
  const files = ['data01', 'data02', 'data03']; // JSON 파일 이름 목록

  return (
    <div>
      <h1>Chart.js with Vite and React</h1>
      {files.map((file, index) => (
        <div key={index}>
          <h2>{file}</h2>
          <GameChart fileName={file} />
        </div>
      ))}
    </div>
  );
}

export default App
