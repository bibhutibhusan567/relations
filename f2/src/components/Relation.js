import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const relations = ["Father", "Mother", "Son", "Daughter", "Husband", "Wife", "Brother", "Sister", "Grandfather", "Grandmother", "Grandson", "Granddaughter", "Uncle", "Aunt", "Nephew", "Niece", "Cousin"];


export default function TodoTask(props) {
    const [editMode, setEditMode] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
    const [dropdownText, setDropdownText] = useState("Relations");
    const [relation, setRelation] = useState("");

    const saveEditedTag = () => {
        props.editHandler(relation, props.idx)
        console.log(props.idx);
        setEditMode(false);
    }

    return (
        <>
            {editMode ? (
                <>
                    <td>
                        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                            <DropdownToggle caret>
                                {dropdownText}
                            </DropdownToggle>
                            <DropdownMenu>
                                {
                                    relations.map((item, idx) =>
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
                    </td>
                    <td>
                        <Button
                            color="success" onClick={saveEditedTag}
                        >Save Tag
                    </Button>
                    </td>

                </>
            ) : (
                    <td>
                        <Button color="danger" onClick={() => setEditMode(true)}>Edit Tag</Button>
                    </td>
                )
            }
        </>
    );
}