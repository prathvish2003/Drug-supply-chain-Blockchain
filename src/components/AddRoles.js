import React, { useState } from 'react';
import { TextField, Button, MenuItem, Container } from '@mui/material';
import web3 from '../web3';
import { ABI, CONTRACT_ADDRESS } from '../SupplyChainABI';

const SupplyChainContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

function AddRoles() {
    const [roleType, setRoleType] = useState('manufacturer');
    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accounts = await web3.eth.getAccounts();
        try {
            if (roleType === 'manufacturer') {
                await SupplyChainContract.methods.addManufacturer(address, name, place).send({ from: accounts[0] });
            } else if (roleType === 'distributor') {
                await SupplyChainContract.methods.addDistributor(address, name, place).send({ from: accounts[0] });
            } else if (roleType === 'retailer') {
                await SupplyChainContract.methods.addRetailer(address, name, place).send({ from: accounts[0] });
            } else if (roleType === 'pharmacy') {
                await SupplyChainContract.methods.addPharmacy(address, name, place).send({ from: accounts[0] });
            }
            console.log(`${roleType.charAt(0).toUpperCase() + roleType.slice(1)} added:`, { address, name, place });
            alert(`${roleType.charAt(0).toUpperCase() + roleType.slice(1)} added successfully`);
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <Container>
            <h3>Add Role</h3>
            <form onSubmit={handleSubmit}>
                <TextField
                    select
                    label="Role Type"
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="manufacturer">Manufacturer</MenuItem>
                    <MenuItem value="distributor">Distributor</MenuItem>
                    <MenuItem value="retailer">Retailer</MenuItem>
                    <MenuItem value="pharmacy">Pharmacy</MenuItem>
                </TextField>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" type="submit">
                    Add {roleType.charAt(0).toUpperCase() + roleType.slice(1)}
                </Button>
            </form>
        </Container>
    );
}

export default AddRoles;
