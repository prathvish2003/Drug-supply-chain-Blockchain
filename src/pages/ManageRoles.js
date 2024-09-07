import React from 'react';
import AddRoles from '../components/AddRoles';
import { Container } from '@mui/material';

function ManageRoles() {
    return (
        <Container>
            <h2>Manage Roles</h2>
            <AddRoles />
        </Container>
    );
}

export default ManageRoles;
