import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Guild from './component/Guild.js';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/guild" component={Guild} />
      </Switch>
    </Router>
  );
}

export default App;