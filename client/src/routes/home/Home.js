import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Formik } from 'formik';
import s from './home.css';

class Home extends Component {
    getLatLng = async ({ location }, { resetForm }) => {
        const [results] = await geocodeByAddress(location);
        const data = await getLatLng(results);

        resetForm({ location: '' });
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
            <Formik
                initialValues={{ location: '' }}
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
                                </>
                            )}
                        </PlacesAutocomplete>
                        <button type="submit" disabled={!dirty || isSubmitting} className={s.button}>Get Weather</button>
                    </form>
                )}
            </Formik>
        );
    }
}

export default Home;
