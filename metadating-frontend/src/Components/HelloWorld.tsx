import React from 'react'
import axios from 'axios'

export async function getMessageFromAPI() {

    // const response = await fetch ('/api/v1/hello/');
    // console.log(response);
    // return response.json;
    const response = await axios.get('/api/v1/hello/');
    // console.log(response);
    return response.data.string;


}



const HelloWorld = () => {

    const [message, setMessage] = React.useState("");

    // By default this will run when mounted and on any component update
    React.useEffect(() => {

        getMessageFromAPI().then( (apiMessage) => {
            
            if (apiMessage == "") {
                console.log("An error occurred when reaching the api");
                return "Error reachign api";
            } else {
                return apiMessage;
            }

        }).then( (apiMessage) => {

            setMessage(apiMessage);

        });

    }/*, [runIfThisVarChanges]*/)

    return (

        <div>
            <h2>The api message is: { message } </h2>
        </div>

    )
};

export default HelloWorld;
