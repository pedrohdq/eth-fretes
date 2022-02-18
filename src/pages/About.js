import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/modules/web3';

function About() {
    const count = useSelector((state) => state.web3.value);
    const dispatch = useDispatch();

    return (
        <div>
            <h1>About</h1>

            <br />

            <div>
                <button
                    aria-label="Increment value"
                    onClick={() => dispatch(increment())}
                    >
                    Increment
                </button>

                <span>{count}</span>
                
                <button
                    aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}
                    >
                    Decrement
                </button>
            </div>
        </div>
    );
}

export default About;