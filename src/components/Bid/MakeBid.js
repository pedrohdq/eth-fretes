import { useState, useEffect } from 'react';

function MakeBid(props) {
    const [bid, setBid] = useState({
        value: "",
        advance_money: ""
    });

    useEffect(() => {
        props.onChange(bid);
    })

    return (
        <div className='flex' style={{ marginBottom: '25px' }}>
            <div className='flexVertical'>
                <label>Value</label>
                <div className='flex'>
                    <input
                        type="text"
                        className='input inputUnit'
                        name='value'
                        value={bid.value}
                        onChange={e => setBid({ ...bid, value: e.target.value })}
                    />
                    <span className='spanUnit'>ETH</span>
                </div>
            </div>

            <div className='flexVertical'>
                <label>Advance money</label>
                <div className='flex'>
                    <input
                        type="text"
                        className='input inputUnit'
                        name='advance_money'
                        value={bid.advance_money}
                        onChange={e => setBid({ ...bid, advance_money: e.target.value })}
                    />
                    <span className="spanUnit">ETH</span>
                </div>
            </div>
        </div>
    );
}

export default MakeBid;