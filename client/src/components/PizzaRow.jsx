import React from "react";

const PizzaCard = ({ name, quantity, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition duration-300 w-[150px] flex-shrink-0">
      <div className="h-[100px] w-full overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={name}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="p-2 flex flex-col justify-center items-center h-[44px]">
        <p className="text-xs font-semibold text-gray-800 text-center truncate w-full">
          {name}
        </p>
      </div>
    </div>
  );
};

const PizzaRow = () => {
  const pizzas = [
    {
      id: 1,
      name: "Italian",
      quantity: 5,
      img: "https://media.istockphoto.com/id/503818102/photo/mediterranean-pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=RrdJT3acAO8Hzzs2qCcUHuokSrkc6MHmeN3vryb3IUE=",
    },
    {
      id: 2,
      name: "Gujarati",
      quantity: 5,
      img: "https://media.istockphoto.com/id/804651920/photo/traditional-indian-lunch-with-various-foods.webp?a=1&b=1&s=612x612&w=0&k=20&c=tY-U0T38HNfV0-bbXc8KOUISxlm6sTnf4Xfzs3S8RBA=",
    },
    {
      id: 3,
      name: "Punjabi",
      quantity: 5,
      img: "https://media.istockphoto.com/id/1266580591/photo/indian-traditional-thali-food-dal-makhani-served-with-chapati-papad-kadai-paneer-or-lemon-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=78DFGFo-VKwCwAlwQWvxXixNBIU9J4uthBlmqQY-NQ0=",
    },
    {
      id: 4,
      name: "Chinize",
      quantity: 5,
      img: "https://media.istockphoto.com/id/1470114571/photo/instant-noodles.webp?a=1&b=1&s=612x612&w=0&k=20&c=xsUQkF89T5KWU85JaqVfigMbkeYvdZliZraGy6sRCRo=",
    },
    {
      id: 5,
      name: "South Indian",
      quantity: 5,
      img: "https://images.unsplash.com/photo-1743517894265-c86ab035adef?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHNvdXRoJTIwaW5kaWFuJTIwZm9vZCUyMHdoaXRlJTIwYmd8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 6,
      name: "Feels Home Made",
      quantity: 5,
      img: "https://images.unsplash.com/photo-1742599361489-a29ca87f92a9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHZlZyUyMHdpdGglMjB3aGl0ZSUyMGJhY2tncm91bmQlMjBpbiUyMGluZGlhbnxlbnwfh8w8MHx8fA%3D",
    },
    {
      id: 7,
      name: "Momo",
      quantity: 5,
      img: "https://media.istockphoto.com/id/1490878690/photo/gyoza-chinese-dumplings-isolated-fried-vegetable-jiaozi-chicken-momo-pile-asian-gyoza-group.jpg?s=612x612&w=0&k=20&c=XNJ4Cax1ktAdTEOM3mAj9hv2yQsGlc6ivxE7fuhkeOg=",
    },
  ];

  return (
    <div className="overflow-x-hidden p-4 bg-gray-50 rounded-lg">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
        {pizzas.map((pizza) => (
          <PizzaCard
            key={pizza.id}
            name={pizza.name}
            quantity={pizza.quantity}
            imageUrl={pizza.img}
          />
        ))}
      </div>
    </div>
  );
};

export default PizzaRow;
