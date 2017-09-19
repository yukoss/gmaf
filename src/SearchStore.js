import React from 'react';
import Autosuggest from 'react-autosuggest';
import _ from 'lodash';

function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    let request = fetch(`https://fnw-ml.herokuapp.com/us/stores/search?store_name=${value}`, {method:'GET'});

    return request;
  }

  function getSuggestionValue(suggestion) {
    return `${suggestion.store_name}, ${suggestion.city}, ${suggestion.state}`;
  }

  function renderSuggestion(suggestion) {
    return (
      <span>{suggestion.store_name}, {suggestion.city}, {suggestion.state}</span>
    );
  }

export default class SearchStore extends React.Component {
    constructor() {
      super();

      this.state = {
        value: '',
        suggestions: []
      };
    }

    onChange = (event, { newValue, method }) => {
      this.setState({
        value: newValue
      });
    };

    onSuggestionsFetchRequested = ({ value }) => {
      getSuggestions(value)
        .then(stores => {
           return stores.json();
        })
        .then(stores => {
          this.setState({
            suggestions: stores
          });
        })
        .catch(err => console.error(err))
    };

    onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: []
      });

      this.s
    };

    render() {
      const { value, suggestions } = this.state;
      const inputProps = {
        placeholder: "Stores",
        value,
        onChange: this.onChange
      };

      const searches = _.debounce(value => this.onSuggestionsFetchRequested(value), 2000);

      return (
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={searches}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps} />
      );
    }
  }