import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Formik } from 'formik';
import s from './home.css';

class Home extends Component {
    getLatLng = async ({ location }, { resetForm }) => {
        const [results] = await geocodeByAddress(location);
        const { lat, lng } = await getLatLng(results);
        console.log(`${lat} ${lng}`);
        resetForm({ location: '' });
    }

    render() {
        return (
            <Formik
                initialValues={{ location: '' }}
                onSubmit={this.getLatLng}
            >
                {({ values, handleSubmit, setFieldValue }) => (
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
                        <button type="submit" className={s.button}>Submit</button>
                    </form>
                )}
            </Formik>
        );
    }
}

export default Home;
