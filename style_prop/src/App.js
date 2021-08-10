import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button type="danger">Click me</Button>
        <Button type="primary" >Click me</Button>
        <Button>Click me</Button>
      </header>
    </div>
  );
}

const buttonDefaultStyle = {
  
}

function Button(props) {

  const buttonStyle = {}

  if (props.type === "primary") {
    buttonStyle["--normal-background"] = "blue"
    buttonStyle["--hover-background"] = "darkblue"
    buttonStyle["--active-background"] = "lightblue"
  } else if (props.type === "danger") {
    buttonStyle["--normal-background"] = "red"
    buttonStyle["--hover-background"] = "darkred"
    buttonStyle["--active-background"] = "pink"
  }
  buttonStyle["--border-radius"] = "30px"
  return (
    <button className="Button" style={buttonStyle}>{props.children}</button>
  )
}

export default App;
