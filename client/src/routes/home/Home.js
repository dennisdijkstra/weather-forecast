import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { Formik } from 'formik';
import s from './home.css';

class Home extends Component {
    getLatLng = async ({ location, date }, { resetForm }) => {
        const formattedDate = moment(date).format();
        const [results] = await geocodeByAddress(location);
        const { lat, lng } = await getLatLng(results);
        const data = { lat, lng, formattedDate };

        resetForm({ location: '', date: moment().toDate() });
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
        const json = await response.json();
        console.log(json);
    }

    render() {
        return (
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
                        setFieldValue
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
                            <button type="submit" disabled={!dirty || isSubmitting} className={s.button}>Get Weather</button>
                        </form>
                    )}
                </Formik>
            </div>
        );
    }
}

export default Home;
