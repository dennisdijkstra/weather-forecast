import React, { Component } from 'react';
import { Grid } from 'styled-css-grid';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { Formik } from 'formik';
import SideBar from '../../components/sidebar';
import Content from '../../components/content';
import Button from '../../components/button';
import s from './home.css';

class Home extends Component {
    state = {
        weather: null,
    }

    getLatLng = async ({ location, date }, { setSubmitting }) => {
        const formattedDate = moment(date).format();
        const [results] = await geocodeByAddress(location);
        const { lat, lng } = await getLatLng(results);
        const data = { lat, lng, formattedDate };

        setSubmitting(false);
        this.getWeather(data);
    }

    getWeather = async (data) => {
        const response = await fetch('/api/weather/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const weather = await response.json();
        this.setState({ weather });
    }

    render() {
        const { weather } = this.state;
        const temperature = weather?.currently?.temperature;

        return (
            <Grid
                columns="300px 1fr"
                areas={['sidebar content']}
                height="100vh"
                gap="0"
            >
                <SideBar>
                    <h1>Get observed or forecasted weather conditions</h1>
                    <Formik
                        initialValues={{ location: '', date: moment().toDate() }}
                        onSubmit={this.getLatLng}
                    >
                        {({
                            values,
                            dirty,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <PlacesAutocomplete
                                    value={values.location}
                                    onChange={value => setFieldValue('location', value)}
                                    onSelect={this.handleSelect}
                                >
                                    {({ getInputProps, getSuggestionItemProps, suggestions }) => (
                                        <>
                                            <input
                                                {...getInputProps({
                                                    placeholder: 'Enter a location',
                                                })}
                                            />
                                            <div className={s.suggestions}>
                                                {suggestions.map(suggestion => (
                                                    <div {...getSuggestionItemProps(suggestion)}>
                                                        <span className={s.suggestion}>
                                                            {suggestion.description}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <DatePicker
                                                selected={values.date}
                                                onChange={value => setFieldValue('date', value)}
                                                minDate={moment().subtract(30, 'days').toDate()}
                                                maxDate={moment().add(30, 'days').toDate()}
                                            />
                                        </>
                                    )}
                                </PlacesAutocomplete>
                                <Button disabled={!dirty || isSubmitting}>Show Weather</Button>
                            </form>
                        )}
                    </Formik>
                </SideBar>
                <Content>
                    {weather ? (
                        <p>Temperature: {temperature} &#8451;</p>
                    ) : (
                        <p>No weather results yet ..</p>
                    )}
                </Content>
            </Grid>
        );
    }
}

export default Home;
