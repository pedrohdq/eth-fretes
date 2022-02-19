import { useEffect, useState } from 'react';

function Dates(props) {
    const [dates, setDates] = useState({
        date_limit_get_load: "",
        date_limit_delivery: ""
    });

    useEffect(() => {
        props.onChange(dates)
    });

    return (
        <div>
            <h4 className='marginTop left' style={{ paddingLeft: '0px' }}>{ props.title }</h4>
                <div className='flex flexLeft'>
                    <div className='flexVertical'>
                        <label>Date limit to get the load</label>
                        <input
                            type="datetime-local"
                            className='input'
                            name='dates.date_limit_get_load'
                            value={dates.date_limit_get_load}
                            onChange={e => setDates({ ...dates, date_limit_get_load: e.target.value })}
                        />
                    </div>

                    <div className='flexVertical'>
                        <label>Date limit to deliver the load at the destination</label>
                        <input
                            type="datetime-local"
                            className='input'
                            name='dates.date_limit_delivery'
                            value={dates.date_limit_delivery}
                            onChange={e => setDates({ ...dates, date_limit_delivery: e.target.value })}
                        />
                    </div>
                </div>
        </div>
    );
}

export default Dates;