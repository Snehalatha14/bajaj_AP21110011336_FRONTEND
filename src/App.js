import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const filters = ['Numbers', 'Alphabets', 'Highest Lowercase Alphabet']; // Updated filter name

    const handleJsonInput = (e) => {
        setJsonInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Raw JSON Input:", jsonInput);

        try {
            const data = JSON.parse(jsonInput);
            console.log("Parsed Data:", data);

            if (!data || !data.data || !Array.isArray(data.data)) {
                alert('Invalid JSON format: Expected { "data": [...] }');
                return;
            }

            console.log("Sending data to backend:", data.data);
            const res = await axios.post('https://bajaj-ap-21110011336-backend.vercel.app/bfhl', { data: data.data });
            console.log("API Response:", res.data);
            setResponse(res.data);
        } catch (error) {
            console.error('Error occurred during submission:', error);
            if (error.response) {
                alert('Server error: ' + error.response.data.message);
            } else {
                alert('Invalid JSON input or server error. Please check your input or try again later.');
            }
        }
    };

    const handleSelectFilter = (filter) => {
        if (!selectedOptions.includes(filter)) {
            setSelectedOptions([...selectedOptions, filter]);
        }
    };

    const removeFilter = (filter) => {
        setSelectedOptions(selectedOptions.filter((item) => item !== filter));
    };

    const renderResponse = () => {
        if (!response) return null;

        const displayData = {};
        if (selectedOptions.includes('Numbers')) displayData.numbers = response.numbers;
        if (selectedOptions.includes('Alphabets')) displayData.alphabets = response.alphabets;
        if (selectedOptions.includes('Highest Lowercase Alphabet')) displayData.highest_lowercase_alphabet = response.highest_lowercase_alphabet; // Corrected the field

        return (
            <div>
                <h3>Filtered Response</h3>
                <pre>{JSON.stringify(displayData, null, 2)}</pre>
            </div>
        );
    };

    return (
        <div className="App">
            <h1>BFHL Frontend</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={jsonInput}
                    onChange={handleJsonInput}
                    placeholder='Enter JSON request here'
                    rows="5"
                    cols="50"
                ></textarea>
                <br />
                <button type="submit">Submit</button>
            </form>

            {response && (
                <div>
                    <h3>Select Data to Display</h3>
                    <div className="filter-container">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleSelectFilter(filter)}
                                className={`filter-button ${selectedOptions.includes(filter) ? 'active' : ''}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="selected-filters">
                        {selectedOptions.map((filter) => (
                            <div key={filter} className="filter-tag">
                                {filter}
                                <span onClick={() => removeFilter(filter)}> x</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {renderResponse()}
        </div>
    );
}

export default App;
