import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button type="danger">Click me</Button>
        <Button type="primary" >Click me</Button>
        <Button>Click me</Button>
        <StyledButton>Click Me Too!</StyledButton>
        <DangerButton>Warning !!!</DangerButton>
      </header>
    </div>
  );
}

const StyledButton = styled.button`
  --normal-background: green;
  --hover-background: darkgreen;
  --active-background: lightgreen;
  font-size: 20px;
  background-color: var(--normal-background);
  color: white;
  border: none;
  border-radius: ${props => props.borderRadius || 5}px;
  padding: 10px;
  outline: none;
  margin: 10px;
  
  &:hover {
    background-color: var(--hover-background); 
  }

  &:active {
    background-color: var(--active-background);
  }
`;

const DangerButton = styled(StyledButton)`
  --normal-background: red;
  --hover-background: darkred;
  --active-background: pink;
`;

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
  buttonStyle["--border-radius"] = "55px"
  return (
    <StyledButton borderRadius="10" style={buttonStyle}>{props.children}</StyledButton>
  )
}

export default App;
