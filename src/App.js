import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient, { gql } from "apollo-boost";

const GEORA_API_KEY = "o7g##rwefqih^%KKFefifeoiheif#SUPERDUPERSECRETANDSECURElhfushuk%#@$3@!3";
const GEORA_ACTOR = "ea17e44d-e18a-4d8b-a794-7f169d277b14";

class App extends React.Component {
  state = {
    client: new ApolloClient({
      uri: "http://localhost:3000",
      headers: { "geora-key": GEORA_API_KEY, "geora-actor": GEORA_ACTOR },
    }),
    code: "",
    coffeeShown: false,
    dummyState:
      { "asset": { "version": 56, "location": "Jamie's Farm", "certifiableClaims": [{ "label": "isOrganic", "value": 1, "__typename": "CertifiableClaim" }, { "label": "grade", "value": 5, "__typename": "CertifiableClaim" }, { "label": "price", "value": 100, "__typename": "CertifiableClaim" }, { "label": "variety", "value": 1, "__typename": "CertifiableClaim" }], "auxiliaryClaims": [{ "label": "Farmer name", "value": "Jamie", "__typename": "AuxiliaryClaim" }], "__typename": "Asset" } }
  }

  render() {
    return (
      <ApolloProvider client={this.state.client}>

        {!this.state.coffeeShown ? <div className="App">
          <header className="App-header">
            <div>
              <h1>Painim Kofi</h1>
              <p className="subtitle">Your gateway to coffee provenance.</p>
            </div>

            <div>
              <p>Enter your coffee code:</p>
              <input onChange={(e) => this.setState({ code: e.target.value })}></input>
              <button onClick={() => this.setState({ coffeeShown: true })}>Find</button>
            </div>
            <div className="footer">
              <p>Created using <a href="https://www.geora.io">Geora</a> and the Ethereum blockchain.</p>
              <p>Written by Jamie Cerexhe (jamie@switchmaven.com) and Cadel Watson (cadel.watson@geora.io).</p>
            </div>
          </header>
        </div> :
          <div className="App">
            <header className="App-header">
              <button onClick={() => this.setState({ coffeeShown: false })}>Return</button>
              <h1>Your coffee</h1>
              <DummyAsset dummyState={this.state.dummyState}></DummyAsset>
              {/* <Asset version={this.state.code}></Asset> */}
              <div className="footer">
                <p>Created using <a href="https://www.geora.io">Geora</a> and the Ethereum blockchain.</p>
                <p>Written by Jamie Cerexhe (jamie@switchmaven.com), Cadel Watson (cadel.watson@geora.io), and the participants of the Papua New Guinea NICTA blockchain workshop.</p>
              </div>
            </header>
          </div>}



      </ApolloProvider>

    );

  }
}

const DummyAsset = ({ dummyState }) => {
  const data = dummyState;

  return <div>
    <p>Origin: {data.asset.location}</p>
    <p>Farmer's name: {getAuxiliaryClaim(data, "Farmer name")}</p>
    <p>Grade: {getCertifiableClaim(data, "grade")}</p>
    <p>Variety: {getCertifiableClaim(data, "variety") === 1 ? "Arabica" : "Robusta"}</p>
  </div>
}

const Asset = ({ version }) =>
  <Query query={gql`
  {
    asset(version: ${version}) {
      version
      location

      certifiableClaims {
        label
        value
      }
      
      auxiliaryClaims {
        label
        value
      }
  
    }
  }`}>
    {({ loading, error, data }) => {
      if (loading) return <p>Finding beans...</p>;
      if (error) return <p>Error :(</p>;

      if (data.asset.location === "Unknown") {
        return <div>
          <p>Not available</p>
        </div>
      } else {
        return <div>
          <p>{JSON.stringify(data)}</p>
          <p>Origin: {data.asset.location}</p>
          <p>Farmer's name: {getAuxiliaryClaim(data, "Farmer name")}</p>
          <p>Grade: {getCertifiableClaim(data, "grade")}</p>
          <p>Variety: {getCertifiableClaim(data, "variety") === 1 ? "Arabica" : "Robusta"}</p>
        </div>
      }
    }}

  </Query>


function getCertifiableClaim(data, label) {
  const claim = data.asset.certifiableClaims.find((claim) => claim.label === label);

  return claim ? claim.value : "Unknown";
}


function getAuxiliaryClaim(data, label) {
  const claim = data.asset.auxiliaryClaims.find((claim) => claim.label === label);

  return claim ? claim.value : "Unknown";
}

export default App;
