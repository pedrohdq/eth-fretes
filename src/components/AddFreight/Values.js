import { useEffect, useState } from 'react';

function Values(props) {
    const [values, setValues] = useState({
        estipulated_value: "",
        fine_delivery_late: "",
        guarantee_value: ""
    })

    useEffect(() => {
        props.onChange(values)
    });

    return (
        <div>
            <h4 className='marginTop left' style={{ paddingLeft: '0px' }}>{ props.title }</h4>
                <div className='flex flexLeft'>
                    <div className='flexVertical'>
                        <label style={{ marginLeft: '5px' }}>Estipulated value</label>
                        <div className='flex'>
                            <input
                                type="text"
                                className='input inputUnit'
                                name='values.estipulated_value'
                                value={values.estipulated_value}
                                onChange={e => setValues({ ...values, estipulated_value: e.target.value })}
                            />
                            <span className='spanUnit'>ETH</span>
                        </div>
                    </div>

                    <div className='flexVertical'>
                        <label style={{ marginLeft: '5px' }}>Fine delivery late</label>
                        <div className='flex'>
                            <input
                                type="text"
                                className='input inputUnit'
                                name='values.fine_delivery_late'
                                value={values.fine_delivery_late}
                                onChange={e => setValues({ ...values, fine_delivery_late: e.target.value })}
                            />
                            <span className='spanUnit'>ETH</span>
                        </div>
                    </div>

                    <div className='flexVertical'>
                        <label style={{ marginLeft: '5px' }}>Guarantee value</label>
                        <div className='flex'>
                            <input
                                type="text"
                                className='input inputUnit'
                                name='value.guarantee_value'
                                value={values.guarantee_value}
                                onChange={e => setValues({ ...values, guarantee_value: e.target.value })}
                            />
                            <span className='spanUnit'>ETH</span>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default Values;