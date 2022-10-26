import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './weekly-report.css';

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
        console.log()
        e.preventDefault();

        const getGoogleSheetID = (link)  => {
            const temp = link.substring(link.indexOf('/d/') + 3)
            return temp.substring(0, temp.indexOf('/'))
        };
        
        const reportData = {
            link: getGoogleSheetID(this.state.link), 
            datestart: this.state.datestart,
            dateend: this.state.dateend
        };

        axios.post('http://localhost:8080/clients/paste_weekly_report', reportData)
            .then( res => console.log(res.data));

        // window.location = "/";
    };

        
    render() {
        return ( 
        <div className="container">
            <div className="card">
                <div className="card-image">	
                    <h2 className="card-heading">Sales Weekly Report</h2>
                </div>
                <form onSubmit={this.onSubmit} className="card-form">
                    <div className="input">
                        <input 
                            type="text" 
                            className="input-field" 
                            required value={this.state.link}
                            onChange={this.onChangeLink}
                        />
                        <label className="input-label">Google Sheet URL</label>
                    </div>
                    <div className="dates" style={
                        { height: '100px' }
                        }>
                        <div className="input" style={{
                            position: 'absolute',
                            
                        }}>
                            <DatePicker 
                                selected={this.state.datestart}
                                onChange={this.onChangeDateStart}
                            />
                            <label style={{ 'paddingBottom': '0.5rem'}} className="input-label">Start date</label>
                        </div>
                        <div className="input" style={{
                            position: 'absolute',
                            right: '2rem'
                        }}>
                            <DatePicker 
                                selected={this.state.dateend}
                                onChange={this.onChangeDateEnd}
                            />
                            <label style={{ 'paddingBottom': '0.5rem'}} className="input-label">End date</label>
                        </div>	
                    </div>
                    <div className="action">
                        <button className="action-button">Create Report</button>
                    </div>
                </form>
            </div>
        </div>
        );
    }
}