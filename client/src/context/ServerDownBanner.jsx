import { ServerOffIcon } from 'lucide-react';
import React from 'react';

const ServerDownUI = () => {

    return (
        <div className='min-w-full min-h-screen flex  justify-center place-items-center'>
            <div className='flex flex-col items-center text-center'>
                <ServerOffIcon size={150} />
                <h1 className='pt-10 text-2xl font-semibold'>Internal Server Error </h1>
                <p className='p-2 text-sm text-gray-400'>Please check your server and try again</p>

                <button onClick={() => window.location.reload()} className='mt-4 bg-indigo-600 text-white font-bold w-32 rounded-lg py-2 px-4 hover:bg-indigo-700 transition-colors'>
                    Try again
                </button>
            </div>
        </div >
    );
};

export default ServerDownUI;
