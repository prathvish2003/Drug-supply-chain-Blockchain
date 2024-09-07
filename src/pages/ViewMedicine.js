import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Grid } from '@mui/material';
import web3 from '../web3';
import { ABI, CONTRACT_ADDRESS } from '../SupplyChainABI';

const SupplyChainContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

function ViewMedicine() {
    const [batchID, setBatchID] = useState('');
    const [aadharID, setAadharID] = useState('');
    const [manufacturerAddress, setManufacturerAddress] = useState('');
    const [currentStage, setCurrentStage] = useState('');
    const [roles, setRoles] = useState({});
    const [purchasedMedicines, setPurchasedMedicines] = useState([]);
    const [manufacturerMedicines, setManufacturerMedicines] = useState([]);

    const handleViewStage = async () => {
        try {
            const stage = await SupplyChainContract.methods.getMedicineStage(batchID).call();
            setCurrentStage(stage);
            console.log(`Current Stage of Batch ID ${batchID}: ${stage}`);
        } catch (error) {
            console.error("Error fetching current stage:", error);
            setCurrentStage('Error');
        }
    };

    const handleViewSupplyChain = async () => {
        try {
            const manufacturerDetails = await SupplyChainContract.methods.getManufacturerDetails(batchID).call();
            const distributorDetails = await SupplyChainContract.methods.getDistributorDetails(batchID).call();
            const retailerDetails = await SupplyChainContract.methods.getRetailerDetails(batchID).call();
            const pharmacyDetails = await SupplyChainContract.methods.getPharmacyDetails(batchID).call();

            setRoles({
                manufacturer: `${manufacturerDetails[1]}, ${manufacturerDetails[2]} (${manufacturerDetails[0]})`,
                distributor: distributorDetails[0] !== '0x0000000000000000000000000000000000000000' ? `${distributorDetails[1]}, ${distributorDetails[2]} (${distributorDetails[0]})` : 'Not Assigned',
                retailer: retailerDetails[0] !== '0x0000000000000000000000000000000000000000' ? `${retailerDetails[1]}, ${retailerDetails[2]} (${retailerDetails[0]})` : 'Not Assigned',
                pharmacy: pharmacyDetails[0] !== '0x0000000000000000000000000000000000000000' ? `${pharmacyDetails[1]}, ${pharmacyDetails[2]} (${pharmacyDetails[0]})` : 'Not Assigned',
            });

            console.log(`Supply Chain of Batch ID ${batchID}:`, {
                manufacturer: `${manufacturerDetails[1]}, ${manufacturerDetails[2]} (${manufacturerDetails[0]})`,
                distributor: distributorDetails[0] !== '0x0000000000000000000000000000000000000000' ? `${distributorDetails[1]}, ${distributorDetails[2]} (${distributorDetails[0]})` : 'Not Assigned',
                retailer: retailerDetails[0] !== '0x0000000000000000000000000000000000000000' ? `${retailerDetails[1]}, ${retailerDetails[2]} (${retailerDetails[0]})` : 'Not Assigned',
                pharmacy: pharmacyDetails[0] !== '0x0000000000000000000000000000000000000000' ? `${pharmacyDetails[1]}, ${pharmacyDetails[2]} (${pharmacyDetails[0]})` : 'Not Assigned',
            });
        } catch (error) {
            console.error("Error fetching supply chain roles:", error);
            setRoles({ manufacturer: 'Error', distributor: 'Error', retailer: 'Error', pharmacy: 'Error' });
        }
    };

    const handleRetrieveMedicineList = async () => {
        try {
            const medicines = await SupplyChainContract.methods.getDrugsByAadhar(aadharID).call();
            setPurchasedMedicines(medicines);
            console.log(`Medicines linked to Aadhar ID ${aadharID}:`, medicines);
        } catch (error) {
            console.error("Error fetching purchased medicines:", error);
            setPurchasedMedicines([]);
        }
    };

    const handleViewMedicinesByManufacturer = async () => {
        try {
            const medicines = await SupplyChainContract.methods.getMedicinesByManufacturer(manufacturerAddress).call();
            setManufacturerMedicines(medicines);
            console.log(`Medicines manufactured by ${manufacturerAddress}:`, medicines);
        } catch (error) {
            console.error("Error fetching medicines by manufacturer:", error);
            setManufacturerMedicines([]);
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '40px' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '30px' }}>
                    View Medicine Information
                </Typography>

                {/* View Medicine Stage */}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Batch ID"
                            value={batchID}
                            onChange={(e) => setBatchID(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleViewStage} fullWidth>
                            View Stage
                        </Button>
                    </Grid>
                </Grid>

                {currentStage && (
                    <Box mt={2}>
                        <Typography variant="h6">
                            Current Stage: {currentStage}
                        </Typography>
                    </Box>
                )}

                {/* View Supply Chain */}
                <Box mt={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleViewSupplyChain} fullWidth>
                                View Supply Chain
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {roles.manufacturer && (
                    <Box mt={2}>
                        <Typography variant="h6">
                            Supply Chain Information
                        </Typography>
                        <Typography variant="body1">Manufacturer: {roles.manufacturer}</Typography>
                        <Typography variant="body1">Distributor: {roles.distributor}</Typography>
                        <Typography variant="body1">Retailer: {roles.retailer}</Typography>
                        <Typography variant="body1">Pharmacy: {roles.pharmacy}</Typography>
                    </Box>
                )}

                {/* View Purchased Medicines */}
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        View Purchased Medicines
                    </Typography>
                    <Grid container spacing={2}>
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
                            <Button variant="contained" color="primary" onClick={handleRetrieveMedicineList} fullWidth>
                                Retrieve Medicine List
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {purchasedMedicines.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="h6">Purchased Medicines</Typography>
                        <ul>
                            {purchasedMedicines.map((batch, index) => (
                                <li key={index}>Batch ID: {String(batch)}</li>
                            ))}
                        </ul>
                    </Box>
                )}

                {purchasedMedicines.length === 0 && aadharID && (
                    <Typography variant="body1" color="error" style={{ marginTop: '20px' }}>
                        No medicines found for the given Aadhar ID.
                    </Typography>
                )}

                {/* View Medicines by Manufacturer */}
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        View Medicines by Manufacturer
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Manufacturer Address"
                                value={manufacturerAddress}
                                onChange={(e) => setManufacturerAddress(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleViewMedicinesByManufacturer} fullWidth>
                                View Medicines by Manufacturer
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {manufacturerMedicines.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="h6">Medicines Manufactured</Typography>
                        <ul>
                            {manufacturerMedicines.map((batch, index) => (
                                <li key={index}>Batch ID: {String(batch)}</li>
                            ))}
                        </ul>
                    </Box>
                )}

                {manufacturerMedicines.length === 0 && manufacturerAddress && (
                    <Typography variant="body1" color="error" style={{ marginTop: '20px' }}>
                        No medicines found for the given manufacturer address.
                    </Typography>
                )}
            </Paper>
        </Container>
    );
}

export default ViewMedicine;
