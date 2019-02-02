import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { Formik } from 'formik';
import { Cell } from 'styled-css-grid';
import s from './sidebar.css';

class SideBar extends Component {
    static propTypes = {
        setWeather: PropTypes.func.isRequired,
    };

    getLatLng = async ({ location, date }, { setSubmitting }) => {
        const formattedDate = moment(date).format();
        const [results] = await geocodeByAddress(location);
        const { lat, lng } = await getLatLng(results);
        const data = { lat, lng, formattedDate };

        setSubmitting(false);
        this.getWeather(data);
    }

    getWeather = async (data) => {
        const { setWeather } = this.props;
        const response = await fetch('/api/weather/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const weather = await response.json();
        setWeather(weather);
    }

    render() {
        return (
            <Cell area="sidebar" className={s.sidebar}>
                <div>
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
                                                        <span className={s.suggestion}>{suggestion.description}</span>
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
                                <button type="submit" disabled={!dirty || isSubmitting} className={s.button}>Show Weather</button>
                            </form>
                        )}
                    </Formik>
                </div>
            </Cell>
        );
    }
}

export default SideBar;
