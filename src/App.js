import React, {useState, useRef, useCallback} from 'react';
import './App.css';
import produce from 'immer'

const numRows = 50
const numCols = 50

const operations = [
  [0,1],
  [0,-1],
  [1,-1],
  [-1,1],
  [1,1],
  [-1,-1],
  [1,0],
  [-1,0]

]

function App() {
  const [grid, setGrid] = useState(()=>{
    const rows = []
    for (let i=0; i< numRows; i++){
      rows.push(Array.from(Array(numCols), ()=> 0))
    }
    return rows
  })

  const newGrid = () =>{
    const rows = []
    for (let i=0; i< numRows; i++){
      rows.push(Array.from(Array(numCols), ()=> 0))
    }
    return rows
  }


  const [running, setRunning] = useState(false);

  let [count, setCount] = useState(0)

  const runningRef = useRef();
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current){
      return;}
    
    else{setCount(count++)
    }

    setGrid(g =>{
      return produce(g, gridCopy =>{
        for (let i=0; i < numRows; i++){
          for (let k=0; k < numCols; k++){
            let neighbors = 0;
            operations.forEach(([x,y]) =>{
              const newI = i+x;
              const newK = k+y;
              if (newI >=0 && newI < numRows && newK >= 0 && newK < numCols){
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3){
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors ===3){
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    })

   

    setTimeout(runSimulation, 100)
  }, [])
  
  return (
    <>
      <h4>Counter: {count}</h4>
      <button onClick ={() => {
        setRunning(!running);
        runningRef.current = true
        runSimulation()
      }}>{running ? 'stop' : 'start'}</button>
      <button onClick ={()=>{
        setGrid(newGrid())
        setCount(0)
        if (!runningRef.current){
          return;}
      }}>clear</button>
      <div className="App"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}
      >
        {grid.map((rows,i)=>
          rows.map((col, k)=>
            <div key={`${i}-${k}`}
            onClick = {()=>{
              const newGrid = produce(grid, gridCopy =>{
                gridCopy[i][k] = grid[i][k] ? 0 : 1
              })
              setGrid(newGrid)
            }}
            style = {{
              width: 20,
              height: 20,
              backgroundColor: grid[i][k] ? 'black' : undefined,
              border: 'solid 1px black'
            }}>
      
            </div>
          )
        )}
      </div>
    </>
  );
  
}

export default App;
