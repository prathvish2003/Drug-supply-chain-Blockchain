import React, { useState } from 'react';
import { TextField, Button, Container } from '@mui/material';
import web3 from '../web3';
import { ABI, CONTRACT_ADDRESS } from '../SupplyChainABI';

const SupplyChainContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

function MedicineInfo() {
    const [batchID, setBatchID] = useState('');
    const [stage, setStage] = useState('');
    const [roles, setRoles] = useState({});

    const getStage = async () => {
        const currentStage = await SupplyChainContract.methods.getMedicineStage(batchID).call();
        setStage(currentStage);
    };

    const getRoles = async () => {
        const [manufacturer, distributor, retailer, pharmacy] = await SupplyChainContract.methods.getRoleIDs(batchID).call();
        setRoles({ manufacturer, distributor, retailer, pharmacy });
    };

    return (
        <Container>
            <h3>Medicine Info</h3>
            <TextField
                label="Batch ID"
                value={batchID}
                onChange={(e) => setBatchID(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={getStage}>
                Get Stage
            </Button>
            <Button variant="contained" color="primary" onClick={getRoles}>
                Get Roles
            </Button>

            {stage && <p>Current Stage: {stage}</p>}
            {roles.manufacturer && (
                <div>
                    <p>Manufacturer: {roles.manufacturer}</p>
                    <p>Distributor: {roles.distributor}</p>
                    <p>Retailer: {roles.retailer}</p>
                    <p>Pharmacy: {roles.pharmacy}</p>
                </div>
            )}
        </Container>
    );
}

export default MedicineInfo;
