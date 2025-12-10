'use client'
// components/Form.js
import React from 'react'
import { useRef, useState } from 'react';


const Form = () => {

    // 1. Create a reference to the input so we can fetch/clear it's value.
    const inputEl = useRef(null);
    // 2. Hold a message in state to handle the response from our API.
    const [message, setMessage] = useState('');

    const subscribe = async (e) => {
        e.preventDefault();

        // 3. Send a request to our API with the user's email address.
        const res = await fetch('/api/subscribeUser', {
            body: JSON.stringify({
                email: inputEl.current.value,
            }),
            headers: {
                'Content-Type': '/application/json',
            },
            method: 'POST',
        });

        const { error } = await res.json();

        if (error) {
            // 4. If there was an error, update the message in state.
            setMessage(error);

            return;
        }

        // 5. Clear the input value and show a success message.
        inputEl.current.value = '';
        setMessage('Success! 🎉 You are now subscribed to the newsletter.');
    };

    return (
        <div className='max-w-[1240px] m-auto p-4'>
            <h1 className='text-2xl font-bold text-center p-4'>Subscribe to the Newsletter</h1>
            <form onSubmit={subscribe} className='max-w-[600px] m-auto'>
                <input className='border shadow-lg p-3 w-full my-2' type="email"
                    id="email-input"
                    name="email"
                    placeholder="miso@davids.house"
                    ref={inputEl}
                    required
                     />
                <div>
                    {message
                        ? message
                        : `I'll only send emails when new content is posted. No spam.`}
                </div>
                <button type="submit" className='border shadow-lg p-3 w-full mt-2'>Subscribe</button>
            </form>
        </div>
    )
}

export default Form