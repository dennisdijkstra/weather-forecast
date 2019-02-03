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

    handleDateChangeRaw = (e) => {
        e.preventDefault();
    }

    render() {
        const { weather } = this.state;
        const { data: [{
            humidity,
            summary,
            temperatureLow,
            temperatureHigh,
            windSpeed,
        }] } = weather?.daily || { data: [{}] };

        return (
            <Grid
                columns="300px 1fr"
                areas={['sidebar content']}
                height="100vh"
                gap="0"
                className={s.grid}
            >
                <SideBar>
                    <h2>Get observed or forecasted weather conditions.</h2>
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
                                            <label htmlFor="location">
                                                Location:
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
                                            <label htmlFor="date">
                                                <span style={{ display: 'block' }}>Date:</span>
                                                <DatePicker
                                                    id="date"
                                                    calendarClassName={s.calender}
                                                    selected={values.date}
                                                    onChange={value => setFieldValue('date', value)}
                                                    minDate={moment().subtract(30, 'days').toDate()}
                                                    maxDate={moment().add(30, 'days').toDate()}
                                                    onChangeRaw={this.handleDateChangeRaw}
                                                />
                                                <div className={s['form-field-error']}>{errors.date}</div>
                                            </label>
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
                        <>
                            <h1>
                                <div>&mdash;</div>
                                {summary}
                                <div>&mdash;</div>
                            </h1>
                            <ul>
                                <li><span className={s.bold}>Max temp:</span> {temperatureHigh} &#8451;</li>
                                <li><span className={s.bold}>Min temp:</span> {temperatureLow} &#8451;</li>
                                <li><span className={s.bold}>Humidity:</span> {(humidity * 100).toFixed(0)}%</li>
                                <li><span className={s.bold}>Windspeed:</span> {windSpeed} km/h</li>
                            </ul>
                        </>
                    ) : (
                        <h1>
                            <div>&mdash;</div>
                            There are no weather results yet.
                            <div>&mdash;</div>
                        </h1>
                    )}
                </Content>
            </Grid>
        );
    }
}

export default Home;
