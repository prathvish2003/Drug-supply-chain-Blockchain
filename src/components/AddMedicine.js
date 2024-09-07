import React, { useState } from 'react';
import { TextField, Button, Container } from '@mui/material';
import web3 from '../web3';
import { ABI, CONTRACT_ADDRESS } from '../SupplyChainABI';

const SupplyChainContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

function AddMedicine() {
    const [batchID, setBatchID] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accounts = await web3.eth.getAccounts();
        try {
            await SupplyChainContract.methods.addMedicine(batchID, name, description).send({ from: accounts[0] });
            console.log('Medicine added:', { batchID, name, description });
            alert('Medicine added successfully');
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <Container>
            <h3>Add Medicine</h3>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Batch ID"
                    value={batchID}
                    onChange={(e) => setBatchID(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" type="submit">
                    Add Medicine
                </Button>
            </form>
        </Container>
    );
}

export default AddMedicine;
