import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NewItem from "./Components/Items/NewItem";
import Landing from "./Components/Landing";
import Auth from "./Components/Auth";
import "antd/dist/antd.css";
import Items from "./Components/Items";
import Shops from "./Components/Shop";
//import FAQ   from "./Components/Faq"
import NewShop from "./Components/Shop/NewShop";
import Shop from "./Components/Shop/Shop";
import "./App.css"


class App extends React.Component {

    render() {

        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component = { Landing } />
                        <Route exact path="/auth" component = { Auth } />
                        <Route exact path="/items" component = { Items } />
                        <Route exact path="/shops" component = { Shops } />
                        <Route exact path="/shops/new" component = { NewShop } />
                        <Route exact path="/shops/:id" component = { Shop } />

                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
