import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/manage-roles">Manage Roles</Button>
                <Button color="inherit" component={Link} to="/manage-medicine">Manage Medicine</Button>
                <Button color="inherit" component={Link} to="/view-medicine">View Medicine</Button>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
