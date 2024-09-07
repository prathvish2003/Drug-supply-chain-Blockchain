import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import web3 from '../web3';
import { ABI, CONTRACT_ADDRESS } from '../SupplyChainABI';

const SupplyChainContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

function ManageMedicine() {
    const [addBatchID, setAddBatchID] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [updateBatchID, setUpdateBatchID] = useState('');
    const [stage, setStage] = useState('');
    const [sellBatchID, setSellBatchID] = useState('');
    const [aadharID, setAadharID] = useState('');
    const [currentAccount, setCurrentAccount] = useState('');

    const fetchAccount = async () => {
        const accounts = await web3.eth.getAccounts();
        setCurrentAccount(accounts[0]);
    };

    const handleAddMedicine = async () => {
        try {
            await fetchAccount();
            const isManufacturer = await SupplyChainContract.methods.manufacturers(currentAccount).call();
            if (isManufacturer.addr === currentAccount) {
                await SupplyChainContract.methods
                    .addMedicine(addBatchID, name, description)
                    .send({ from: currentAccount });
                console.log("Medicine Added", { addBatchID, name, description });
            } else {
                alert("Only manufacturers can add medicines.");
            }
        } catch (error) {
            console.error("Error adding medicine:", error);
        }
    };

    const handleUpdateStage = async () => {
        try {
            await fetchAccount();

            if (["Manufacture", "Distribution", "Retail", "Pharmacy"].includes(stage)) {
                await SupplyChainContract.methods
                    .updateMedicineStage(updateBatchID)
                    .send({ from: currentAccount });
                console.log(`Stage Updated to ${stage}`, { updateBatchID });
            } else {
                alert("Invalid stage selected.");
            }
        } catch (error) {
            console.error("Error updating stage:", error);
        }
    };

    const handleSellMedicine = async () => {
        try {
            await fetchAccount();
            const isPharmacy = await SupplyChainContract.methods.pharmacies(currentAccount).call();
            if (isPharmacy.addr === currentAccount) {
                await SupplyChainContract.methods
                    .sellMedicine(sellBatchID, aadharID)
                    .send({ from: currentAccount });
                console.log("Medicine Sold", { sellBatchID, aadharID });
            } else {
                alert("Only pharmacies can sell medicines.");
            }
        } catch (error) {
            console.error("Error selling medicine:", error);
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '40px' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Manage Medicine
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Add Medicine
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Batch ID"
                            value={addBatchID}
                            onChange={(e) => setAddBatchID(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleAddMedicine} fullWidth>
                            Add Medicine
                        </Button>
                    </Grid>
                </Grid>

                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Update Medicine Stage
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Batch ID"
                                value={updateBatchID}
                                onChange={(e) => setUpdateBatchID(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Stage</InputLabel>
                                <Select
                                    value={stage}
                                    onChange={(e) => setStage(e.target.value)}
                                    label="Stage"
                                >
                                    <MenuItem value="Manufacture">Manufacture</MenuItem>
                                    <MenuItem value="Distribution">Distribution</MenuItem>
                                    <MenuItem value="Retail">Retail</MenuItem>
                                    <MenuItem value="Pharmacy">Pharmacy</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleUpdateStage} fullWidth>
                                Update Stage
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Sell Medicine
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Batch ID"
                                value={sellBatchID}
                                onChange={(e) => setSellBatchID(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Aadhar ID"
                                value={aadharID}
                                onChange={(e) => setAadharID(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleSellMedicine} fullWidth>
                                Sell Medicine
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default ManageMedicine;
