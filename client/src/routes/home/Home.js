import React, { Component } from 'react';
import { Grid } from 'styled-css-grid';
import SideBar from '../../components/sidebar/SideBar';
import WeatherResults from '../../components/weatherResults/WeatherResults';

class Home extends Component {
    state = {
        weather: null,
    }

    setWeather = (weather) => {
        this.setState({ weather });
    }

    render() {
        const { weather } = this.state;

        return (
            <Grid
                columns="300px 1fr"
                areas={['sidebar content']}
                height="100%"
                gap="0"
            >
                <SideBar setWeather={this.setWeather} />
                <WeatherResults weather={weather} />
            </Grid>
        );
    }
}

export default Home;
