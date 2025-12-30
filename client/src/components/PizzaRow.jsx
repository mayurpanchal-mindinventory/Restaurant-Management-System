import React from "react";

const PizzaCard = ({ name, imageUrl }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col w-full">
      {/* Aspect Ratio Container makes image height responsive */}
      <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-gray-50">
        <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
      </div>
      <div className="p-3 flex items-center justify-center min-h-[50px]">
        <p className="text-sm md:text-base font-semibold text-gray-800 text-center line-clamp-2">
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
      img: "https://media.istockphoto.com/id/503818102/photo/mediterranean-pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=RrdJT3acAO8Hzzs2qCcUHuokSrkc6MHmeN3vryb3IUE=",
    },
    {
      id: 2,
      name: "Gujarati",
      img: "https://media.istockphoto.com/id/804651920/photo/traditional-indian-lunch-with-various-foods.webp?a=1&b=1&s=612x612&w=0&k=20&c=tY-U0T38HNfV0-bbXc8KOUISxlm6sTnf4Xfzs3S8RBA=",
    },
    {
      id: 3,
      name: "Punjabi",
      img: "https://media.istockphoto.com/id/1266580591/photo/indian-traditional-thali-food-dal-makhani-served-with-chapati-papad-kadai-paneer-or-lemon-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=78DFGFo-VKwCwAlwQWvxXixNBIU9J4uthBlmqQY-NQ0=",
    },
    {
      id: 4,
      name: "Chinese",
      img: "https://media.istockphoto.com/id/1470114571/photo/instant-noodles.webp?a=1&b=1&s=612x612&w=0&k=20&c=xsUQkF89T5KWU85JaqVfigMbkeYvdZliZraGy6sRCRo=",
    },
    {
      id: 5,
      name: "South Indian",
      img: "https://images.unsplash.com/photo-1743517894265-c86ab035adef?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHNvdXRoJTIwaW5kaWFuJTIwZm9vZCUyMHdoaXRlJTIwYmd8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 6,
      name: "Home Made",
      img: "https://images.unsplash.com/photo-1742599361489-a29ca87f92a9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHZlZyUyMHdpdGglMjB3aGl0ZSUyMGJhY2tncm91bmQlMjBpbiUyMGluZGlhbnxlbnwfh8w8MHx8fA%3D",
    },
    {
      id: 7,
      name: "Momo",
      img: "https://media.istockphoto.com/id/1490878690/photo/gyoza-chinese-dumplings-isolated-fried-vegetable-jiaozi-chicken-momo-pile-asian-gyoza-group.jpg?s=612x612&w=0&k=20&c=XNJ4Cax1ktAdTEOM3mAj9hv2yQsGlc6ivxE7fuhkeOg=",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* GRID LAYOUT: 
          grid-cols-2 (Mobile) 
          sm:grid-cols-3 (Small Tablets)
          md:grid-cols-4 (Tablets)
          lg:grid-cols-7 (Desktops) 
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {pizzas.map((pizza) => (
          <PizzaCard key={pizza.id} name={pizza.name} imageUrl={pizza.img} />
        ))}
      </div>
    </div>
  );
};

export default PizzaRow;
