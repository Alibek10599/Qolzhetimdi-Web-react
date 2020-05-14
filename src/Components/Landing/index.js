import React from "react";
import {Link} from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer1 from "../Layout/Footer";

class Landing extends React.Component {


    render() {
        return (
            <div>
                <div>
                    <Navbar />
                    <div>
                        <h1>
                            Welcome to Qolzhetimdi
                        </h1>
                        <Link to="/auth" className="uk-button-primary">
                            Authenticate
                        </Link>
                        <Link to="/items/new" className="uk-button-primary">
                            New item
                        </Link>
                        <Footer1/>
                    </div>
                </div>
            </div>
        );
    }
}


export default Landing;
