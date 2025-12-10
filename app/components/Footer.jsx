'use client'
// components/Footer.js
import React from 'react'
import MailchimpSubscribe from 'react-mailchimp-subscribe';

const Footer = () => {
  const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;


  const SimpleForm = () => <MailchimpSubscribe url={url}/>
  return (
    <footer className="bg-secondary border-t-2 border-primary/50">
        <div className="flex-col items-center justify-around mt-12 sm:mt-0">
          <div className='flex items-center justify-around p-3'>
            Contact
          </div>
          <div className='p-3 border border-primary/0 rounded-md flex flex-col'>
            <h1 className='text-2xl font-bold text-center text-primary'>Subscribe to the Newsletter</h1>
          <MailchimpSubscribe className="flex flex-col" url={process.env.NEXT_PUBLIC_MAILCHIMP_URL} 
          render={({ subscribe, status, message }) => (
            <div>
              <SimpleForm onSubmitted={formData => subscribe(formData)} />
              {status === "sending" && <div className='primary'>sending...</div>}
              {status === "error" && <div style={{ color: "red" }} dangerouslySetInnerHTML={{__html: message}}/>}
              {status === "success" && <div style={{ color: "green" }}>Subscribed !</div>}
            </div>
          )}/>
          </div>
        </div>
    </footer>

  );
}

export default Footer