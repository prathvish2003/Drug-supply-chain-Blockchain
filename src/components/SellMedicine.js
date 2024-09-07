import React, { useState } from 'react';
import { TextField, Button, Container } from '@mui/material';
import web3 from '../web3';
import { ABI, CONTRACT_ADDRESS } from '../SupplyChainABI';

const SupplyChainContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

function SellMedicine() {
    const [batchID, setBatchID] = useState('');
    const [aadharID, setAadharID] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accounts = await web3.eth.getAccounts();
        try {
            await SupplyChainContract.methods.sellMedicine(batchID, aadharID).send({ from: accounts[0] });
            console.log(`Medicine sold for Batch ID ${batchID} and Aadhar ID ${aadharID}`);
            alert('Medicine sold successfully');
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <Container>
            <h3>Sell Medicine</h3>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Batch ID"
                    value={batchID}
                    onChange={(e) => setBatchID(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Aadhar ID"
                    value={aadharID}
                    onChange={(e) => setAadharID(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" type="submit">
                    Sell Medicine
                </Button>
            </form>
        </Container>
    );
}

export default SellMedicine;
