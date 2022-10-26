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
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            link: '',
            datestart: new Date(),
            dateend: new Date(),
            status: '',
            buttontext: 'Create Report'
        };
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

    onChangeStatus(statusBool) {
        if (statusBool) {
            this.setState({
                status: 'Report successfully exported!'
            });
            document.getElementById('status').style.color = 'darkgreen';
            this.setState({
                buttontext: 'Open Report'
            });
        } else {
            this.setState({
                status: 'Incorrect Google Sheet URL'
            });
            document.getElementById('status').style.color = 'red';
        }
    };

    onSubmit(e) {
        e.preventDefault();
        if (this.state.buttontext === 'Open Report') {
            window.open(this.state.link,'_blank');
            return true;
        }
        
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
            .then( res => this.onChangeStatus(res.data))
    };

    render() {
        var status = this.state.status.toString();
        var buttontext = this.state.buttontext.toString();
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
                        <button className="action-button">{buttontext}</button>
                    </div>
                    <p id="status" className="status">{status}</p>
                </form>
            </div>
        </div>
        );
    }
}