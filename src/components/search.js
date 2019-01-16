import React, { Component } from 'react';


//fixing the display of body(description) of items
function htmlDecode(input){
    let e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

//displaying items from search query
function NumberList(props) {
    let sItems = props.items;
    let makeFav = props.favourite;
    let listItems = sItems.map((item) =>
        <div className="searchItem" key={item.title}>
            <div className="fav"  onClick={() => makeFav(item)}>
                <i className={(item.favour ? "fas fa-star starGreen" : "fas fa-star starGrey")}> </i>
            </div>
            <div className="searchName">
                <p>{item.title}</p>
            </div>
            <div className="searchDescription" >
                <div dangerouslySetInnerHTML={{__html: htmlDecode(item.body)}} />
            </div>
        </div>

    );
    return (
        <div className="items">
            {listItems}
            <div className={sItems.length === 0 ? "textVisible" : "textNotVisible"}>Nothing to display. Try searching now!</div>
        </div>
    );
}


//displaying favourite list
function FavList(props) {
    let sItems = props.items;
    let makeFav = props.favourite;
    let listItems = sItems.map((item) =>
        <div className="searchItem" key={item.title}>
            <div className="fav" onClick={() => makeFav(item)}>
                <i className={(item.favour ? "fas fa-star starGreen" : "fas fa-star starGrey")}> </i>
            </div>
            <div className="searchName">
                <p>{item.title}</p>
            </div>
            <div className="searchDescription">
                <div dangerouslySetInnerHTML={{__html: htmlDecode(item.body)}} />
            </div>
        </div>

    );
    return (
        <div className="items">
            {listItems}
            <div className={sItems.length === 0 ? "textVisible" : "textNotVisible"}>Your favourite list is empty!</div>
        </div>
    );
}

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrolled: false,
            scrolledHead: false,
            searchedItems: [],
            data: null,
            valueSearch: '',
            favList: [],
            searchActive: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFav = this.handleFav.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

    }


    //saving the value of the input
    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
        if(value === ""){
            this.setState({
                searchedItems: [],
            });
        }
    }


    //on pressing Enter do the search
    handleSearch(event){
        if(event.keyCode === 13){
            this.handleClick(event);
        }
    }


    //on clicking the button do the search
    handleClick(event){
        event.preventDefault();
        let searchQuery = this.state.valueSearch;
        let sortedArray = this.state.data.filter(function(choice){
                return choice.keywords.includes(searchQuery);
            });
        this.setState({
            searchedItems: sortedArray
        })
    }


    //managing the favourite list
    handleFav(favItem){
        let newFavouriteArray = this.state.favList;
        if(newFavouriteArray.includes(favItem)){
            favItem.favour = false;
            let snewFavouriteArray = newFavouriteArray.filter(item => item.title !== favItem.title);
            this.setState({
                favList: snewFavouriteArray
            })
        }else{
            favItem.favour = true;
            newFavouriteArray.push(favItem);
            this.setState({
                favList: newFavouriteArray
            })
        }
    }
    //loading the JSON file as the component loads
    componentDidMount() {
        let requestURL = 'https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000';
        let request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.onload = function() {
            let wasteList = request.response;
            this.setState({
                data: wasteList,
                searchActive: true
            })
        }.bind(this);
        request.send();

    }
    render() {
        return (
            <main>
                <div className="container containerSearch">
                    <div>
                        <div id="searchForm">
                            <input type="text" id="search" name="valueSearch" required placeholder="Search.."   onChange={this.handleChange} onKeyDown={this.handleSearch}/>
                            <button type="submit" onClick={this.handleClick} disabled={!this.state.searchActive}><i className="fas fa-search"> </i></button>
                        </div>
                    </div>
                </div>
                <div className="searchField">
                    <div className="container">
                        <NumberList items={this.state.searchedItems} favourite={this.handleFav}/>
                    </div>
                </div>
                <div className="favouritesField">
                    <div className="container">
                        <h2>Favourites <span className={this.state.favList.length === 0 ? "textNotVisible" : "counter"}>{this.state.favList.length}</span></h2>
                        <FavList items={this.state.favList} favourite={this.handleFav}/>
                    </div>
                </div>
            </main>
        );
    }
}





export default Search;