import React, { Component } from 'react'

const SearchResults = ({results, display_cols}) => 
    <div className="m-search-results" style={{"padding": "0px"}} data-grid="col-12">
        <div data-grid="col-12">
            {results.map((result, index) =>
                <SearchResult result={result} key={index} display_cols={display_cols}/>
            )}
        </div>
        { results.length > 10 && 
        <div data-grid="col-12">
            <a href="http://www.getmwf.com" className="c-hyperlink">Show all</a>
        </div>
        }
    </div>


const SearchResult = ({result, display_cols}) => 
    <div data-grid="col-10" className="f-result-item">
        { display_cols.map((r,ri) => {
            if (r.type === "link1") { return(
                <h3 key={ri} className="f-hyperlink">
                    { r.vals.map((c,ci) => 
                        <a key={ci} href={`http://getdata.com/${c.val}?id=${result[c.id]}`} className="c-hyperlink">{result[c.val]}</a>
                    )}
                </h3>
            )} else if (r.type === "link2") { return(
                <span key={ri} className="f-hyperlink">
                    { r.vals.map((c,ci) => 
                        <a key={ci} href={`http://getdata.com/${c.val}?id=${result[c.id]}`} className="c-hyperlink">{result[c.val]}</a>
                    )}
                </span>
            )} else if (r.type === "pills") { return(
                <p key={ri} className="c-paragraph-3">
                    { r.vals.map((c,ci) => 
                        <span key={ci} style={{"marginRight": "5px"}}><strong className="c-badge f-small f-highlight">{result[c.val]}</strong></span>
                    )}
                </p>
            )} else { return(
                <p key={ri} className="c-paragraph-3">
                    { r.vals.map((c,ci) => 
                        <span key={ci}> {result[c.val]} </span>
                    )}
                }
                </p>
            )}
        })}
    </div>
            


export default class SearchUI extends Component {
    
    state = {  index: Object.keys(this.props.metadata)[0], searchstr: "", selected_facets: {}, results: [], facets: {} }

    componentDidMount() {
        this.search()
    }
    

    //$filter=rating eq 3 and category eq 'Motel'
    search () {
        console.log (`search: selected_facets: ${JSON.stringify(this.state.selected_facets)}`)
        let filter = Object.keys(this.state.selected_facets).map(fn => 
            this.state.selected_facets[fn].map(val => encodeURIComponent(`${fn} eq ${isNaN(val)? "'":""}${val}${isNaN(val)? "'":""}`)).join(' or ')
        ).join(') and (') 

        if (filter)  {
            filter = `&$filter=(${filter})`
        }
        console.log (`search: query filter : ${filter}`)
        fetch (`${this.props.url}/indexes/${this.props.metadata[this.state.index].index}/docs?api-version=2016-09-01-Preview&search=${encodeURIComponent(this.state.searchstr)}&${this.props.metadata[this.state.index].facet_cols.map(f => `facet=${f}`).join('&')}${filter}`,
            {
                headers: {
                     "api-key": this.props.apikey,
                }
            }
        ).then(response => {
            console.log (`got response ${response.status}`)
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText));
            } else {
                // this returns a Promise to the chained method
                
                return response.json()
            }
        }).then(json => {
            //console.log (JSON.stringify(json.value,null,1))
            this.setState ({results: json.value, facets: json["@search.facets"]})
        }, err => console.log(`failed to get cases : ${err}`)
        ).catch((err) => {
            console.log("error " + err);
        })
    }

    handleChange(event) {
        this.setState({searchstr: event.target.value});
    }

    checkRet(event) {
        if (event.keyCode === 13 ) {
            return this.search();
        }
    }

    handleFacetChange(fname, fval, event) {
        if (fname === "index") {
            this.setState({index: fval, selected_facets: {}, results: [] , facets: {}}, () => this.search())
        } else {
            console.log (`handleFacetChange: got ${fname} ${event.target.checked}`)
            let selected_facets = this.state.selected_facets

            if (event.target.checked) {
                if (!selected_facets[fname]) selected_facets[fname] = []
                selected_facets[fname].push(fval)
            } else {
                let ridx = selected_facets[fname].findIndex(e => e === fval)
                selected_facets[fname].splice(ridx, 1)
                if (selected_facets[fname].length === 0) {
                    delete selected_facets[fname]
                }
            }
            console.log (`setting state: ${JSON.stringify(selected_facets)}`)
            this.setState({selected_facets: selected_facets}, this.search)
        }
    }

    render() {
        console.log (`render: selected_facets: ${JSON.stringify(this.state.selected_facets)}`)
        return (
            <div className="container">
                <div className="row">

                    <div className="m-panes m-panes-section-ext" data-grid="col-12">
                        <section>
                            <div data-grid="col-12" style={{"paddingTop": "48px"}}>
                                <div className="c-search" style={{"maxWidth": "90%"}}>
                                    <input  onChange={this.handleChange.bind(this)} onKeyDown={this.checkRet.bind(this)} aria-label="Enter your search"  type="search" name="search-field" role="searchbox" placeholder="Search"/>
                                    <button onClick={this.search.bind(this)}  className="c-glyph" name="search-button">
                                        <span className="x-screen-reader">Search</span>
                                    </button>
                                </div>
                            </div>
                            <div data-grid="col-12" style={{"paddingTop": "48px"}}>
                                <SearchResults results={this.state.results} display_cols={this.props.metadata[this.state.index].display_cols}/>
                            </div>
                        </section>
                        <section>
                            <div className="m-additional-information " style={{"boarderLeft": "0px solid rgba(0,0,0,.2)"}}>
                                <div data-grid="col-12 stack-2">
                                        <ul  className="c-list f-bare f-lean">
                                            <li>
                                                <strong>Index</strong>
                                            </li>
                                            <li>
                                            {Object.keys(this.props.metadata).map((m, midx) =>
                                                <div key={midx}  className="c-checkbox">
                                                    <label className="c-label">
                                                        <input aria-label="Control label (unselected)" type="checkbox" checked={this.state.index === m} onChange={this.handleFacetChange.bind(this, "index", m)}/>
                                                        <span aria-hidden="true">{m}</span>
                                                    </label>
                                                </div>
                                            )}
                                            </li>
                                        </ul>
                                        {this.props.metadata[this.state.index].facet_cols.map((fname, idx1) =>
                                        <ul key={idx1} className="c-list f-bare f-lean">
                                            <li>
                                                <strong>{fname}</strong>
                                            </li>
                                            <li>
                                                {this.state.facets[fname] && this.state.facets[fname].map((fc, idx2) =>
                                                    <div key={idx2} className="c-checkbox">
                                                        <label className="c-label">
                                                            <input aria-label="Control label (unselected)" type="checkbox" checked={this.state.selected_facets[fname] ? this.state.selected_facets[fname].includes(fc.value) : false} onChange={this.handleFacetChange.bind(this, fname, fc.value)}/>
                                                            <span aria-hidden="true">{fc.value} ({fc.count})</span>
                                                        </label>
                                                    </div>
                                                )}
                                            </li>
                                        </ul>
                                        )}
                                </div>
                            </div> 
                        </section>  
                    </div>
                </div>
            </div>
        )
    }
}
