import React, { useState } from 'react';
import {
    Card, CardText,
    CardTitle, Button
} from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';



export default function SearchPlane(props) {
    const [dropdownOpenOne, setDropdownOpenOne] = useState(false);
    const [dropdownOpenTwo, setDropdownOpenTwo] = useState(false);
    const toggleOne = () => setDropdownOpenOne(!dropdownOpenOne);
    const toggleTwo = () => setDropdownOpenTwo(!dropdownOpenTwo);
    const [dropdownTextOne, setDropdownTextOne] = useState("UserOne");
    const [dropdownTextTwo, setDropdownTextTwo] = useState("UserTwo");
    const [userOne, setUserOne] = useState();
    const [userTwo, setUserTwo] = useState();
    const [error, setError] = useState();
    const [response, setResponse] = useState();

    const getRelations = (userOne, userTwo) => {
        if (isNullOrUndefined(userOne) || isNullOrUndefined(userTwo) || userOne === userTwo) {
            setError("please select both user/ You might select same user");
        } else {
            console.log("before fetch", userOne, userTwo);
            fetch('http://localhost:9000/getrelation',
                {
                    method: "post",
                    body: JSON.stringify(
                        {
                            firstUser: userOne,
                            secondUser: userTwo
                        }
                    ),
                    headers: { 'content-type': "application/json" },
                })
                .then((res) => res.json())
                .then((arr) => {
                    setResponse(arr);
                    setError();
                });
        }
        console.log(response);
    }
    const isNullOrUndefined = (val) => val === null || val === undefined;
    return (
        <Card body inverse color="success" style={{ width: "35%", top: "143px", marginLeft: "660px", position: "fixed" }}>
            <CardTitle tag="h5">Find Relations here</CardTitle>
            <CardTitle>How user One is related to user two ?
            </CardTitle>
            <div>
                <Dropdown isOpen={dropdownOpenOne} toggle={toggleOne} style={{ float: "left" }} >
                    <DropdownToggle caret>
                        {dropdownTextOne}
                    </DropdownToggle>
                    <DropdownMenu>
                        {
                            props.userArray.map((item, idx) =>
                                <DropdownItem
                                    onClick={() => {
                                        setDropdownTextOne(item);
                                        setUserOne(item);
                                    }}
                                    key={idx}>
                                    {item}
                                </DropdownItem>)}
                    </DropdownMenu>
                </Dropdown>
                <Dropdown isOpen={dropdownOpenTwo} toggle={toggleTwo} style={{ float: "right" }}>
                    <DropdownToggle caret>
                        {dropdownTextTwo}
                    </DropdownToggle>
                    <DropdownMenu>
                        {
                            props.userArray.map((item, idx) =>
                                <DropdownItem
                                    onClick={() => {
                                        setDropdownTextTwo(item);
                                        setUserTwo(item);
                                    }}
                                    key={idx}>
                                    {item}
                                </DropdownItem>)}
                    </DropdownMenu>
                </Dropdown>
            </div>
            <br />
            <Button
                onClick={() => getRelations(userOne, userTwo)}
                style={{ width: "65%", marginLeft: "60px", }}
                color="primary"
            >Get All possible Relations</Button>
            {isNullOrUndefined(error) ? (
                <>
                    { response && response.map((response, idx) => {
                        return (<div key={idx}>{response}</div>)
                    })}
                </>
            ) : (
                    <div>{error}</div>)}

        </Card >
    );
}
