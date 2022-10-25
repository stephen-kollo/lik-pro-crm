import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Client = props => (
    <tr>
        <td>{props.client.autopayID}</td>
        <td>{props.client.clientName}</td>
        <td>{props.client.email}</td>
        <td>{props.client.revenue}</td>
        <td>{props.client.status}</td>
        <td>{props.client.dateCreate}</td>
        <td>{props.client.datePaid}</td>
        <td>{props.client.product}</td>
        <td>{props.client.phone}</td>
        <td>{props.client.ip}</td>
        <td>{props.client.managerComment}</td>
        <td>{props.client.leadType}</td>
        <td>{props.client.managerPayout}</td>
        <td>
            <Link to={"/edit/"+props.client._id}>edit</Link> | <a href='#' onClick={() => { props.deleteClient(props.client._id)}}>delete</a>
        </td>
    </tr>
);


export default class ClientList extends Component {
    constructor(props) {
        super(props);

        this.deleteClient = this.deleteClient.bind(this);

        this.state = { clients: [] };
    }

    componentDidMount() {
        axios.get('http://localhost:8080/clients/')
            .then(response => {
                this.setState({ clients: response.data })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    deleteClient(id) {
        axios.delete('http://localhost:8080/clients/' + id)
            .then(res => console.log(res.data));

        this.setState({
            clients: this.state.clients.filter(el => el._id !== id)
        })
    } 
    
    clientList() {
        return this.state.clients.map(currentclient => {
            return <Client client={currentclient} deleteClient={this.deleteClient} key={currentclient._id} />
        })
    }


    render() {
        return (
            <div>
                <h3>Logged Clients</h3>
                <table className='table'>
                    <thead className='thead-light'>
                        <tr>
                            <th>Autopay ID</th>
                            <th>Client Name</th>
                            <th>E-mail</th>
                            <th>Revenue</th>
                            <th>Status</th>
                            <th>Date Created</th>
                            <th>Date Paid</th>
                            <th>Product</th>
                            <th>Phone Number</th>
                            <th>IP</th>
                            <th>Manager Comment</th>
                            <th>Lead Type</th>
                            <th>Manager Payout</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.clientList() }
                    </tbody>
                </table>
            </div>
        );
    }
}