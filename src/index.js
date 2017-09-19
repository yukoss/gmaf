import React from 'react';
import ReactDOM from 'react-dom';
import MapStore from './MapStore';
import SearchStore from './SearchStore';
import registerServiceWorker from './registerServiceWorker';

class App extends React.Component {
  render() {
      return (
          <main className="container">
            <MapStore />
          </main>
      )
  }
}

ReactDOM.render(
    <App />
    , document.getElementById('root'));
registerServiceWorker();
