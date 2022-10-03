import React, { useState } from 'react'
import axios from 'axios'

export async function getMessageFromAPI() {

    // const response = await fetch ('/api/v1/hello/');
    // console.log(response);
    // return response.json;
    const response = await axios.get('/api/v1/hello/');
    // console.log(response);
    return response.data.string;


}

export async function sendMessageToAPI(name: string, age: string, gender: string, interests: string) {
    let data = [name, age, gender, interests]
    const response = await axios.post('/api/v1/recieved/', data);
    return response.data.string;
}

const FormPage = () => {

    const [message, setMessage] = useState("");
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [interests, setInterests] = useState('');

    // By default this will run when mounted and on any component update
    React.useEffect(() => {

        getMessageFromAPI().then((apiMessage) => {
            // NOTE: This is probably wrong. We should look at the response status code instead.
            if (apiMessage === "") {
                console.log("An error occurred when reaching the api");
                return "Error reaching api";
            } else {
                return apiMessage;
            }

        }).then((apiMessage) => {

            setMessage(apiMessage);

        });

    }/*, [runIfThisVarChanges]*/)

    // This function is called when the input changes
    const nameInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredName = event.target.value;
        setName(enteredName);
    };
    const ageInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredAge = event.target.value;
        setAge(enteredAge);
    };
    const genderInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredGender = event.target.value;
        setGender(enteredGender);
    };
    const interestsInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredInterests = event.target.value;
        setInterests(enteredInterests);
    };

    // This function is triggered when the Submit buttion is clicked
    const submit = () => {
        sendMessageToAPI(name, age, gender, interests).then((apiMessage) => {

            if (apiMessage === "") {
                console.log("An error occurred when sending to the api");
                return "Error sending to api";
            } else {
                return apiMessage;
            }

        }).then((apiMessage) => {

            console.log(apiMessage);

        });
    };

    return (

        <div>
            <h2>Form Page</h2>
            <div className="container">
                <div className="wrapper">
                    <input
                        value={name}
                        onChange={nameInputHandler}
                        placeholder="Name"
                        className="input"
                    />
                    <input
                        value={age}
                        onChange={ageInputHandler}
                        placeholder="Age"
                        className="input"
                    />
                    <input
                        value={gender}
                        onChange={genderInputHandler}
                        placeholder="Gender"
                        className="input"
                    />
                    <input
                        value={interests}
                        onChange={interestsInputHandler}
                        placeholder="Interests"
                        className="input"
                    />
                    <button onClick={submit}>Submit</button>
                </div>
            </div>
            <h2>The api message is: {message} </h2>
        </div>

    )
};

export default FormPage;