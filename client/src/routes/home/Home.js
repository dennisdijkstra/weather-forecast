import React, { Component } from 'react';
import { Grid } from 'styled-css-grid';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { Formik } from 'formik';
import validationSchema from '../../validation/ValidationSchema';
import SideBar from '../../components/sidebar';
import Content from '../../components/content';
import Button from '../../components/button';
import s from './home.css';

class Home extends Component {
    state = {
        weather: null,
    }

    getLatLng = async ({ location, date }, { setErrors, setSubmitting }) => {
        try {
            const formattedDate = moment(date).format();
            const [results] = await geocodeByAddress(location);
            const { lat, lng } = await getLatLng(results);
            const data = { lat, lng, formattedDate };

            setSubmitting(false);
            this.getWeather(data);
        } catch (err) {
            setSubmitting(false);
            setErrors({ location: 'Please provide a valid location' });
        }
    }

    getWeather = async (data) => {
        try {
            const response = await fetch('/api/weather/weather', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const weather = await response.json();
            this.setState({ weather });
        } catch (err) {
            console.log(err);
        }
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
                        validationSchema={validationSchema}
                    >
                        {({
                            values,
                            dirty,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue,
                            errors,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <PlacesAutocomplete
                                    value={values.location}
                                    onChange={value => setFieldValue('location', value)}
                                    onSelect={this.handleSelect}
                                >
                                    {({ getInputProps, getSuggestionItemProps, suggestions }) => (
                                        <>
                                            <label htmlFor="location">Location:
                                                <input
                                                    id="location"
                                                    {...getInputProps({
                                                        placeholder: 'Enter a location',
                                                    })}
                                                />
                                                <div className={s['form-field-error']}>{errors.location}</div>
                                            </label>
                                            <div className={s.suggestions}>
                                                {suggestions.map(suggestion => (
                                                    <div {...getSuggestionItemProps(suggestion)}>
                                                        <span className={s.suggestion}>
                                                            {suggestion.description}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <label htmlFor="date">Date:</label>
                                            <DatePicker
                                                id="date"
                                                selected={values.date}
                                                onChange={value => setFieldValue('date', value)}
                                                minDate={moment().subtract(30, 'days').toDate()}
                                                maxDate={moment().add(30, 'days').toDate()}
                                            />
                                            <div className={s['form-field-error']}>{errors.date}</div>
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
                        <h2>Temperature: {temperature} &#8451;</h2>
                    ) : (
                        <h2>No weather results yet ..</h2>
                    )}
                </Content>
            </Grid>
        );
    }
}

export default Home;
