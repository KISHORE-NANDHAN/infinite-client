import React from 'react';
import '../index.css';

function Enter() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/logo.png?alt=media&token=da585e14-f4bd-4a00-ac98-cef73b6ccf54"
          alt="Logo"
          className="w-40 h-14"
        />
        <div className="space-x-4">
          <a href="/app/home">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Home
            </button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center bg-cover bg-center py-24 text-white"
        style={{
          backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/background.jpg?alt=media&token=d2c63907-c2e3-4664-9a76-99ce3161576e)`,
        }}
      >
        <h1 className="text-5xl font-bold mb-4">Welcome to InfiniteConnect</h1>
        <p className="max-w-2xl text-center text-xl mb-8">
          Connect, share, and grow with us in a secure environment. Our platform
          prioritizes your privacy and meaningful connections.
        </p>
      </section>

      {/* Technologies Section */}
      <section className="py-12">
        <h2 className="text-center text-4xl font-semibold mb-8">Technologies We Use</h2>
        <div className="flex justify-center flex-wrap gap-8">
          <TechnologyCard
            imgSrc="https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/react-icon.png?alt=media&token=6129d2cf-9f5c-4089-9033-fa18697c965c"
            techName="React"
          />
          <TechnologyCard
            imgSrc="https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/node-icon.png?alt=media&token=0a163481-b58c-4c97-82a1-7deee0312ba6"
            techName="Node.js"
          />
          <TechnologyCard
            imgSrc="https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/mongodb-icon.png?alt=media&token=0616a988-7fd6-41b1-b81d-aaa30f2ac2b5"
            techName="MongoDB"
          />
          <TechnologyCard
            imgSrc="https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/aws-icon.png?alt=media&token=2da799f8-164b-442c-afcc-a0534942c9a4"
            techName="AWS"
          />
          <TechnologyCard
            imgSrc="https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/github-icon.png?alt=media&token=09ea7473-9dd6-4d44-b957-694742740d58"
            techName="GitHub"
          />
          <TechnologyCard
            imgSrc="https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/Untitled.png?alt=media&token=f97f08b8-d4c0-42e9-b36a-6f9f89fd8966"
            techName="Firebase"
          />
        </div>
      </section>

      {/* Developed By Section */}
      <section className="py-12 bg-gray-50">
        <h2 className="text-center text-4xl font-semibold mb-8">Developed by</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <DeveloperCard
            name="J Kishore Nandhan"
            institution="Lakireddy Balireddy College of Engineering"
            year="3RD YEAR"
          />
          <DeveloperCard
            name="V Nikhil"
            institution="Lakireddy Balireddy College of Engineering"
            year="3RD YEAR"
          />
          <DeveloperCard
            name="D Varun"
            institution="Lakireddy Balireddy College of Engineering"
            year="3RD YEAR"
          />
          <DeveloperCard
            name="VVSL Surya Narayana"
            institution="Lakireddy Balireddy College of Engineering"
            year="3RD YEAR"
          />
          <DeveloperCard
            name="B Vivek"
            institution="Lakireddy Balireddy College of Engineering"
            year="3RD YEAR"
          />
        </div>
      </section>

      <footer className="py-4 text-center bg-gray-200">
        <p>&copy; 2024 InfiniteConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Technology Card Component
function TechnologyCard({ imgSrc, techName }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-40 flex flex-col items-center">
      <img src={imgSrc} alt={techName} className="w-16 h-16 mb-2" />
      <p className="text-center font-semibold">{techName}</p>
    </div>
  );
}

// Developer Card Component
function DeveloperCard({ name, institution, year }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-64 flex flex-col items-start">
      <h3 className="text-xl font-semibold">{name}</h3>
      <p>
        <strong>Institution</strong>: {institution}
      </p>
      <p>
        <strong>YEAR</strong>: {year}
      </p>
    </div>
  );
}

export default Enter;
