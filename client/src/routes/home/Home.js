import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Formik } from 'formik';
import s from './home.css';

class Home extends Component {
    getLatLng = async ({ location }) => {
        const [results] = await geocodeByAddress(location);
        const { lat, lng } = await getLatLng(results);
        console.log(`${lat} ${lng}`);
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
                                            placeholder: 'Enter a city',
                                        })}
                                    />
                                    <div>
                                        {suggestions.map(suggestion => (
                                            <div {...getSuggestionItemProps(suggestion)}>
                                                <span>{suggestion.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </PlacesAutocomplete>
                        <button type="submit">Submit</button>
                    </form>
                )}
            </Formik>
        );
    }
}

export default Home;
