import React, {Component} from 'react';
import { Row, Col } from 'antd';
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import {BASE_URL, NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from "../constants";
import axios from 'axios';
import WorldMap from './WorldMap';

class Main extends Component {
    constructor(){
        super();
        this.state = {
            satInfo: null,
            satList: null,
            settings: null,
            isLoadingList: false
        };
    }

    showNearbySatellite = (setting) => {
        this.setState({
            isLoadingList: true,
            setting: setting
        })
        this.fetchSatellite(setting);
    }

    fetchSatellite= (setting) => {
        const {latitude, longitude, elevation, altitude} = setting;
        const url = `${BASE_URL }/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        this.setState({
            isLoadingList: true
        });

        axios.get(url).then(response => {
                console.log(response.data)
                this.setState({
                satInfo: response.data,
                isLoadingList: false
           })
       }).catch(error => {
           console.log('error in fetch satellite -> ', error);
       })
    }
    showMap = (selected) => {
        this.setState(preState => ({
            ...preState,
            satList: [...selected]
        }))
    }
    render() {
        const { isLoadingList, satInfo, satList, setting } = this.state;
        return (
            <Row className='main'>
                <Col span={8} className="left-side">
                    <SatSetting onShow = {this.showNearbySatellite} />
                    <SatelliteList satInfo={satInfo} isLoad={this.state.isLoadingList} onShowMap = {this.showMap} />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData = {satList} observerData = {setting}/>
                </Col>
            </Row>
        );
    }
}
export default Main;
