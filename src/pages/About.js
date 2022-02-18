import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, increaseByAmount } from '../store/modules/counter';

function About() {
    const count = useSelector((state) => state.counter.value);
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

                <button
                    aria-label="Increment 2 value"
                    onClick={() => dispatch(increaseByAmount(2))}
                    >
                    Increment 2
                </button>
            </div>
        </div>
    );
}

export default About;