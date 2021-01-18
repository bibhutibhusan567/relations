import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function InputFields(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
    const [dropdownText, setDropdownText] = useState("Relations");
    const [firstUser, setFirstUser] = useState("");
    const [secondUser, setSecondUser] = useState("");
    const [relation, setRelation] = useState("");
    return (
        <>
            <InputGroup className="input_group">
                <input
                    type="text"
                    placeholder="first name"
                    onChange={(event) => setFirstUser(event.target.value)}
                    value={firstUser} />
                <InputGroupAddon addonType="append">
                    <InputGroupText>Is</InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon addonType="append">
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle caret>
                            {dropdownText}
                        </DropdownToggle>
                        <DropdownMenu>
                            {
                                props.relations.map((item, idx) =>
                                    <DropdownItem
                                        onClick={() => {
                                            setDropdownText(item);
                                            setRelation(item);
                                        }}
                                        key={idx}>
                                        {item}
                                    </DropdownItem>)}
                        </DropdownMenu>
                    </Dropdown>
                </InputGroupAddon>

                <InputGroupAddon style={{ backgroundColor: "white" }} addonType="prepend">
                    <InputGroupText>Of</InputGroupText>
                </InputGroupAddon>
                <input
                    type="text"
                    placeholder="second name"
                    onChange={(event) => setSecondUser(event.target.value)}
                    value={secondUser} />
                <InputGroupAddon addonType="append">
                    <Button color="primary" onClick={() => props.addNewRelation(firstUser, secondUser, relation)}>Add New Relation</Button>
                </InputGroupAddon>
            </InputGroup>
            {props.error === undefined ? null : (<div style={{ color: "#5600ff" }}><span style={{ color: "orange" }}>Error :</span> {props.error}</div>)}
        </>
    );
}
