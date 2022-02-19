import { useEffect, useState } from 'react';

function Place(props) {
    const [place, setPlace] = useState({
        country: "",
        state: "",
        city: "",
        street: "",
        district: "",
        zipcode: "",
        number: ""
    });

    useEffect(() => {
        props.onChange(place);
    });

    return (
        <div>
            <h4 className='marginTop left' style={{ paddingLeft: '0px' }}>{ props.title }</h4>
                <div className='flex flexLeft'>
                    <div className='flexVertical'>
                        <label>Country</label>
                        <input
                            type="text"
                            className='input'
                            name='place.country'
                            value={place.country}
                            onChange={e => setPlace({ ...place, country: e.target.value })}
                        />
                    </div>

                    <div className='flexVertical'>
                        <label>State</label>
                        <input
                            type="text"
                            className='input'
                            name='place.state'
                            value={place.state}
                            onChange={e => setPlace({ ...place, state: e.target.value })}
                        />
                    </div>

                    <div className='flexVertical'>
                        <label>City</label>
                        <input
                            type="text"
                            className='input'
                            name='place.city'
                            value={place.city}
                            onChange={e => setPlace({ ...place, city: e.target.value })}
                        />
                    </div>

                    <div className='flexVertical'>
                        <label>Street</label>
                        <input
                            type="text"
                            className='input'
                            name='place.street'
                            value={place.street}
                            onChange={e => setPlace({ ...place, street: e.target.value })}
                        />
                    </div>

                    <div className='flexVertical'>
                        <label>District</label>
                        <input
                            type="text"
                            className='input'
                            name='place.district'
                            value={place.district}
                            onChange={e => setPlace({ ...place, district: e.target.value })}
                        />
                    </div>

                    <div className='flexVertical'>
                        <label>Zipcode</label>
                        <input
                            type="text"
                            className='input'
                            name='place.zipcode'
                            value={place.zipcode}
                            onChange={e => setPlace({ ...place, zipcode: e.target.value })}
                        />
                    </div>

                    <div className='flexVertical'>
                        <label>Number</label>
                        <input
                            type="text"
                            className='input'
                            name='place.number'
                            value={place.number}
                            onChange={e => setPlace({ ...place, number: e.target.value })}
                        />
                    </div>
                </div>
        </div>
    );
}

export default Place;