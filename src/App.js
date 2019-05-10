import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { //variables to use
      loading: false,
      error: null,
      /*CryptoListItems: [ //for testing
        {key: "BTC"},
        {key: "ETH"},
        {key: "LTC"}
      ],*/
      CryptoListItems : [] //set to empty because component will render before data arrives async-if null throws error
    };
  }

  componentDidMount() { //component has rendered, make call for data
    this.setState({ isLoading: true }); //will cause rendering
    this.makeRemoteRequest();
    console.log("loading"); //testing
  }

  makeRemoteRequest = () => { //THIS WORKS-setState IS ASYNC SO WILL NOT RENDER IMMEDIATELY
    const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD`;
    this.setState({ loading: true });
    fetch(url)
      .then(function(response){ //gets the raw data
        console.log("getting data"); //testing
        return response.json(); //transforms to json
      })
      .then(function(jsonFromServer){ //jsonFromServer is the above json formatted data response
        console.log("data is good" + jsonFromServer.BTC.USD); //testing

        //map object into array for rendering-needs to be array for flatlist
        var formattedDataforFlatList = []; //ARRAY OF OBJECTS

        //destructure json
        for(let symbol in jsonFromServer) {
          console.log(symbol); //testing
          let nestedValue = jsonFromServer[symbol];
          let price = null; //hold for assignment

          for(let symbolPrice in nestedValue){
            let extractedPrice = nestedValue[symbolPrice];
            console.log(extractedPrice); //testing
            price = extractedPrice;
          }

          var formattedObj = {key:symbol, USD:price} //set key value or trying to access key itself, vs key value in flatlist is nightmare 
          formattedDataforFlatList.push(formattedObj);
          console.log(formattedObj); //testing
        }
        console.log(formattedDataforFlatList); //testing
        //end formatting logic

        this.setState({
          CryptoListItems: formattedDataforFlatList,
          error: null,
          loading: true,
        });
      }.bind(this)) //need to reference current scope or jsonObject var is undefined-or use arrow notatio functions as below
      .catch(function(error) {
        console.log(error);
        this.setState({ error, loading: false });
      });
  };

  /*
  CryptoListItemSeparator = () => { //is an object
    return (
      <View
        style={{
          height: 5,
          width: "100%",
          backgroundColor: "white",
          padding: 10,
        }}
      />
    );
  }
  */

  /*
  render() { //display in UI
    return (
      <View style = {{justifyContent: 'center',alignItems: 'center', padding:20}}>
      
        <Text style={{fontSize:20}}>Latest</Text>
        <FlatList 
          data={ this.state.CryptoListItems } //set data to array
          ItemSeparatorComponent = {this.CryptoListItemSeparator}
          renderItem={({item}) => <Text style={{textAlign: 'center', fontSize:20, fontWeight: "bold"}}>
            {item.key} {item.USD}
          </Text>} //references data in format set
        />
        <Button title="Refresh" onPress={() => this.makeRemoteRequest()}  />
      </View>
    );
  }
  */
  buttonClicked() {
    this.makeRemoteRequest(); //binded scope
  }

  render() { //display
  const { error, loading, CryptoListItems } = this.state;
    if (error) {
        return (
          <div className="App">
            <div className="App-intro">Error: {error.message}</div>
          </div>
        );
    } else if (!loading) {
        return (
          <div className="App">
            <div className="App-intro">Loading...</div>
          </div>
        );
    } else {
      return (
        <div className="App">
          <div className="App-intro">
            <ul>
              {CryptoListItems.map(crypto => (
                <li key={crypto.key}>
                  {crypto.key} {crypto.USD}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={this.buttonClicked.bind(this)}>Refresh Prices</button> {/* binds event handler button */}
        </div>
      );
    }
  }
} //end class

export default App;