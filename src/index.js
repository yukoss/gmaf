import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MapStore from './MapStore';
import SearchStore from './SearchStore';
import registerServiceWorker from './registerServiceWorker';

class App extends React.Component {
    render() {
        return (
            <div>
                <SearchStore />
                <MapStore />
            </div>
        )
    }
}

ReactDOM.render(
    <App />
    , document.getElementById('root'));
registerServiceWorker();
