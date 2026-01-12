import { SearchIcon, SendIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { getChatList } from '../services/restaurantPanelService';
import { sendMessage } from '../services/userService';

function ChatList() {
    const [users, setUsersList] = useState([]);
    const [chatId, setChatId] = useState("");

    const [message, setMessage] = useState("");
    const chatList = async () => {

        const res = await getChatList();
        setUsersList(res?.data[0]);
        console.log(res?.data[0]);

    };
    useEffect(() => {
        chatList();

    }, []);

    const handleSendMessage = async (users) => {

        console.log(users);

        const body = {
            chatId: "6964b80687c31657c67bcc97",
            text: message
        }

        console.log(body);

        const res = await sendMessage(body);

    }

    const chatMessages = async (id) => {

        // const res = await getChatList();
        // setUsersList(res?.data[0]?.members);
        // console.log(res?.data[0].members);

        console.log(id);


    };
    useEffect(() => {
        setChatId()
        chatMessages();

    }, [chatId]);

    function nameToInitials(fullName) {
        const namesArray = fullName.trim().split(' ');
        let initials = namesArray[0].charAt(0).toUpperCase();
        if (namesArray.length > 1) {
            initials += namesArray[namesArray.length - 1].charAt(0).toUpperCase();
        }

        return initials;
    }
    return (
        <>
            <div className="flex overflow-auto w-full shadow-sm">
                <div className="flex w-1/4 flex-col h-[700px] overflow-y-scroll bg-gray-600 rounded-box grow">
                    <div className="relative w-full flex items-center p-4 border-b border-gray-500">
                        <SearchIcon
                            className="absolute left-7 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search by name"
                            className="w-full pl-10 pr-4 py-2 bg-slate-500 rounded-full focus:ring-2 focus:ring-white focus:border-white outline-none transition-all bg-transparent"
                        />
                    </div>

                    {users.length > 0 && users?.map((user, index) => {
                        return (<button id={user?._id} onClick={() => chatMessages(user?._id)} className="flex items-center gap-2 p-3">

                            <div className="h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                                {nameToInitials(user?.name)}
                            </div>
                            <p className='text-white text-sm'>{user?.members[index]?.name}</p>
                        </button>)
                    })
                    }
                </div>
                <div className="card w-3/4 flex h-[700px] flex-col bg-gray-200 rounded-box gap-2 grow">
                    <div className='flex bg-white w-full  border-b border-gray-300'>
                        <div className="flex items-center gap-2 p-3">
                            <img
                                src=
                                "https://placehold.co/400"
                                className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-100 group-hover:ring-indigo-200 transition-all"
                                alt="logo"
                            />
                            <p className='text-black'>Name</p>
                        </div>
                    </div>
                    <div className='overflow-auto'>
                        <div className='ml-2 flex gap-2 flex-col  place-content-between'>
                            <div class="flex justify-start gap-2">
                                <img
                                    src=
                                    "https://placehold.co/400"
                                    className="h-10 w-10 rounded-full object-cover self-center ring-1 ring-slate-100 group-hover:ring-indigo-200 transition-all"
                                    alt="logo"
                                />
                                <div class="max-w-xs md:max-w-md bg-white rounded-lg rounded-bl-none p-3 shadow-sm">
                                    <p class="text-gray-800">
                                        Hello! I need some help with my order.  <span className='text-[8px] text-gray-500'>24/11/2024</span>
                                    </p>
                                </div>

                            </div>

                            <div class="flex justify-end gap-2 mr-2">

                                <div class="max-w-xs md:max-w-md bg-blue-500 text-white rounded-lg rounded-br-none p-3 shadow-sm">
                                    <p class="text-white">
                                        Sure, I can assist you with that. What is your order number? <span className='text-[8px] text-white'>24/11/2024</span>
                                    </p>
                                </div>
                                <img
                                    src=
                                    "https://placehold.co/400"
                                    className="h-10 w-10 rounded-full object-cover self-center ring-1 ring-slate-100 group-hover:ring-indigo-200 transition-all"
                                    alt="logo"
                                />
                            </div>




                        </div>
                    </div>
                    <div className='flex bg-white col sticky border-t-2 border-gray-300 gap-2 top-full'>


                        <div class="relative h-10 w-full min-w-[200px]">
                            <div class="absolute top-2/4 right-3 grid h-5 w-5 -translate-y-2/4 place-items-center text-blue-gray-500">
                                <button onClick={() => handleSendMessage(users)}><SendIcon color='gray' className='hover:orange-500' /></button>
                            </div>
                            <input
                                class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-blue-gray-700"
                                placeholder="Typing..."
                                name='message'
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ChatList;