import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class WeeklyReport extends Component {
    constructor(props) {
        super(props);

        this.onChangeLink = this.onChangeLink.bind(this);
        this.onChangeDateStart = this.onChangeDateStart.bind(this);
        this.onChangeDateEnd = this.onChangeDateEnd.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            link: '',
            datestart: new Date(),
            dateend: new Date(),
        };
    };

    componentDidMount() {
        // axios.get('http://localhost:8080/users/')
        //     .then(response => {
        //         if(response.data.length > 0) {
        //             this.setState({
        //                 users: response.data.map(user => user.username),
        //                 username: response.data[0].username
        //             })
        //         }
        //     })
    };

    onChangeLink(e) {
        this.setState({
            link: e.target.value
        });
    };

    onChangeDateStart(date) {
        this.setState({
            datestart: date
        });
    };
    
    onChangeDateEnd(date) {
        this.setState({
            dateend: date
        });
    };

    onSubmit(e) {
        e.preventDefault();
        const reportData = {
            link: this.state.link, 
            datestart: this.state.datestart,
            dateend: this.state.dateend
        };

        axios.post('http://localhost:8080/clients/paste_weekly_report', reportData)
            .then( res => console.log(res.data));

        // window.location = "/";
    };

        
    render() {
        return (
            <div>
                <h3>Create New Exercise Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className='form-group'>
                        <label>Google Sheet Link: </label>
                        <input
                            type="text"
                            required
                            className='form-control'
                            value={this.state.link}
                            onChange={this.onChangeLink}
                        />
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>Date Start: </label>
                        <div>
                            <DatePicker
                                selected={this.state.datestart}
                                onChange={this.onChangeDateStart}
                            />
                        </div>
                    </div>
                    <br></br>
                    <div className='form-group'>
                        <label>Date End: </label>
                        <div>
                            <DatePicker
                                selected={this.state.dateend}
                                onChange={this.onChangeDateEnd}
                            />
                        </div>
                    </div>
                    <br></br>
                    <div className='form-group'>
                            <input type='submit' value='Create Sales Report' className='btn btn-primary' />
                    </div>
                </form>
            </div>
        );
    }
}