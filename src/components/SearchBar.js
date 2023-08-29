import React, { useState } from 'react';
import './SearchBar.css'; // Import the CSS file

function SearchBar({onSearch}) {

    const [query, setquery ] = useState('');

    const onchange = (event) => {
        setquery(event.target.value);
    }

    const handlesubmit = (event) => {
        event.preventDefault();
        onSearch(query);
    }

    return (
        <div className='searchbar'>
            <form onSubmit={handlesubmit} className='form'>
                <input 
                    type='text'
                    placeholder='Enter Location'
                    value={query}
                    onChange={onchange} className='inputform'>
                </input>
                <button type='submit' className='buttonform'>Search</button>
            </form>
        </div>
    );
}

export default SearchBar;