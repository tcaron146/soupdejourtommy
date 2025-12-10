'use client'
// components/Newsletter.js
import React from 'react'
import { useRef, useState } from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

const Newsletter = () => {
    const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;


    const SimpleForm = () => <MailchimpSubscribe url={url}/>
  return (
    <div className='flex sm:-[50%] h-full'>
          <div className='p-3 border border-primary/0 bg-primary/20 rounded-md flex flex-col'>
            <h1 className='text-2xl font-bold text-center text-secondary'>Subscribe to the Newsletter</h1>
          <MailchimpSubscribe className="flex flex-col" url={process.env.NEXT_PUBLIC_MAILCHIMP_URL} 
          render={({ subscribe, status, message }) => (
            <div>
              <SimpleForm onSubmitted={formData => subscribe(formData)} />
              {status === "sending" && <div className='text-primary'>sending...</div>}
              {status === "error" && <div style={{ color: "red" }} dangerouslySetInnerHTML={{__html: message}}/>}
              {status === "success" && <div style={{ color: "green" }}>Subscribed !</div>}
            </div>
          )}/>
          </div>
        </div>
  )
}

export default Newsletter