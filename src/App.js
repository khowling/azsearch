import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import SearchUI from './searchUI.js'

const RichHeading = ({header1, header2}) => 
        <div className="m-rich-heading  f-image">
            <picture className="c-image">
                <img  src="https://media.licdn.com/mpr/mpr/shrinknp_800_800/p/1/005/0ac/3fe/06aaca7.jpg"/>
            </picture>
            <section  data-grid="container">
                <div data-grid="col-12">
                    <h3 className="c-heading">{header1}</h3>
                    <p className="c-paragraph-3">{header2}</p>
                </div>
            </section>
        </div>

export default class App extends Component {
  render() {
    let metadata = JSON.parse(process.env.REACT_APP_SEARCH_METADATA)
  
    return (
      <main id="mainContent">
        <RichHeading header1={metadata.header1} header2={metadata.header2}/>
        <div data-grid="container">
          <SearchUI url={metadata.search_url} apikey={metadata.search_apikey} metadata={metadata.index_meta}/>
        </div>
      </main>
    );
  }
}


