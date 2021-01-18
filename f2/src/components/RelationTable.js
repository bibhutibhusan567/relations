import React, { useState } from 'react';
import { Table } from 'reactstrap';
import Relation from './Relation';

export default function InputFields(props) {

    const editHandler = (editedTag, idx) => {
        const idToEdit = props.relationsArray[idx]._id;
        console.log("_id", idToEdit);
        console.log(editedTag);
        fetch(`http://localhost:9000/newtag/${idToEdit}`, {
            method: "PUT",
            body: JSON.stringify({ newTag: editedTag }),
            headers: { "Content-Type": "application/json" }
        }).then((r) => r.json())
            .then((resp) => {
                console.log("Got successfull response from PUT", resp);
                props.relationsArray[idx] = resp;
                props.setRelationArray([...props.relationsArray]);
            });
    }

    return (
        <Table dark style={{ width: "60%", marginTop: "20px", marginLeft: "30px" }}>
            <thead>
                <tr>
                    <th>#</th>
                    <th >Relations</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.relationsArray.map((relation, idx) => {
                        return (
                            <tr key={idx}>
                                <td>
                                    {idx + 1}
                                </td>
                                <td>
                                    {relation.firstUser} is {relation.relation} of {relation.secondUser}
                                </td>
                                <Relation idx={idx} editHandler={editHandler} />
                            </tr>
                        )
                    })
                }
            </tbody >
        </Table >
    );
}

