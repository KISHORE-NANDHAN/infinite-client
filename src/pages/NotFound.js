import React from 'react';
import { Link } from 'react-router-dom'; // Adjust path according to your folder structure

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/404.webp?alt=media&token=6c7ff6d3-8a48-425f-9c2a-46e1938e543e" 
        alt="Page not found"
        className="w-full max-w-screen-lg object-cover mb-6"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link 
        to="/" 
        className="text-lg text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
      >
        Go to Login
      </Link>

      <table className="table-auto w-full max-w-4xl mt-8 border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2 text-left">Error Code</th>
            <th className="border border-gray-300 p-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr className="even:bg-gray-100">
            <td className="border border-gray-300 p-2">200</td>
            <td className="border border-gray-300 p-2">OK - The request was successful.</td>
          </tr>
          <tr className="even:bg-gray-100">
            <td className="border border-gray-300 p-2">202</td>
            <td className="border border-gray-300 p-2">Accepted - The request has been accepted for processing.</td>
          </tr>
          <tr className="even:bg-gray-100">
            <td className="border border-gray-300 p-2">301</td>
            <td className="border border-gray-300 p-2">Moved Permanently - The resource has been moved to a new URL.</td>
          </tr>
          <tr className="even:bg-gray-100">
            <td className="border border-gray-300 p-2">400</td>
            <td className="border border-gray-300 p-2">Bad Request - The server could not understand the request.</td>
          </tr>
          <tr className="even:bg-gray-100">
            <td className="border border-gray-300 p-2">401</td>
            <td className="border border-gray-300 p-2">Unauthorized - Authentication is required.</td>
          </tr>
          <tr className="even:bg-gray-100">
            <td className="border border-gray-300 p-2">404</td>
            <td className="border border-gray-300 p-2">Not Found - The requested resource could not be found.</td>
          </tr>
          <tr className="even:bg-gray-100">
            <td className="border border-gray-300 p-2">405</td>
            <td className="border border-gray-300 p-2">Method Not Allowed - The HTTP method is not allowed for the resource.</td>
          </tr>
          <tr className="even:bg-gray-100">
            <td className="border border-gray-300 p-2">500</td>
            <td className="border border-gray-300 p-2">Internal Server Error - The server encountered an unexpected condition.</td>
          </tr>
          <tr className="even:bg-gray-100">
            <td className="border border-gray-300 p-2">503</td>
            <td className="border border-gray-300 p-2">Service Unavailable - The server is temporarily unavailable.</td>
          </tr>
          <tr className="even:bg-gray-100">
            <td className="border border-gray-300 p-2">504</td>
            <td className="border border-gray-300 p-2">Gateway Timeout - The server did not receive a timely response from an upstream server.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NotFound;
