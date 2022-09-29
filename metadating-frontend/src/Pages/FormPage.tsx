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



const FormPage = () => {

    const [message, setMessage] = React.useState("");

    // By default this will run when mounted and on any component update
    React.useEffect(() => {

        getMessageFromAPI().then( (apiMessage) => {
            
            if (apiMessage === "") {
                console.log("An error occurred when reaching the api");
                return "Error reaching api";
            } else {
                return apiMessage;
            }

        }).then( (apiMessage) => {

            setMessage(apiMessage);

        });

    }/*, [runIfThisVarChanges]*/)

    return (

        <div>
            <p className='text-center text-pink-500 font-bold text-5xl'>Form Page</p>
            <h2>The api message is: { message } </h2>
        </div>

    )
};

export default FormPage;