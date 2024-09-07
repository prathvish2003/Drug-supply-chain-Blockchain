import React, { useState } from 'react';
import web3 from '../web3';
import { ABI, CONTRACT_ADDRESS } from '../SupplyChainABI';
import { TextField, Button, Container, MenuItem, Typography } from '@mui/material';

const SupplyChainContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

function UpdateMedicineStage() {
    const [batchID, setBatchID] = useState('');
    const [stage, setStage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accounts = await web3.eth.getAccounts();
        try {
            if (stage === 'manufacture') {
                await SupplyChainContract.methods.manufactureMedicine(batchID).send({ from: accounts[0] });
            } else if (stage === 'distribution') {
                await SupplyChainContract.methods.distributeMedicine(batchID).send({ from: accounts[0] });
            } else if (stage === 'retail') {
                await SupplyChainContract.methods.retailMedicine(batchID).send({ from: accounts[0] });
            }
            console.log(`Stage updated to ${stage} for Batch ID ${batchID}`);
            alert(`Stage updated to ${stage}`);
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Update Medicine Stage
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Batch ID"
                    value={batchID}
                    onChange={(e) => setBatchID(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    select
                    label="Stage"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="manufacture">Manufacture</MenuItem>
                    <MenuItem value="distribution">Distribution</MenuItem>
                    <MenuItem value="retail">Retail</MenuItem>
                </TextField>
                <Button variant="contained" color="primary" type="submit">
                    Update Stage
                </Button>
            </form>
        </Container>
    );
}

export default UpdateMedicineStage;
