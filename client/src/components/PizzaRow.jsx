import React from "react";

const items = [
  {
    n: "Italian",
    i: "https://media.istockphoto.com/id/503818102/photo/mediterranean-pizza.webp?a=1&b=1&s=612x612&w=0&k=20&c=RrdJT3acAO8Hzzs2qCcUHuokSrkc6MHmeN3vryb3IUE=",
  },
  {
    n: "Gujarati",
    i: "https://media.istockphoto.com/id/804651920/photo/traditional-indian-lunch-with-various-foods.webp?a=1&b=1&s=612x612&w=0&k=20&c=tY-U0T38HNfV0-bbXc8KOUISxlm6sTnf4Xfzs3S8RBA=",
  },
  {
    n: "Punjabi",
    i: "https://media.istockphoto.com/id/1266580591/photo/indian-traditional-thali-food-dal-makhani-served-with-chapati-papad-kadai-paneer-or-lemon-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=78DFGFo-VKwCwAlwQWvxXixNBIU9J4uthBlmqQY-NQ0=",
  },
  {
    n: "Chinese",
    i: "https://media.istockphoto.com/id/1470114571/photo/instant-noodles.webp?a=1&b=1&s=612x612&w=0&k=20&c=xsUQkF89T5KWU85JaqVfigMbkeYvdZliZraGy6sRCRo=",
  },
  {
    n: "South Indian",
    i: "https://images.unsplash.com/photo-1743517894265-c86ab035adef?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHNvdXRoJTIwaW5kaWFuJTIwZm9vZCUyMHdoaXRlJTIwYmd8ZW58MHx8MHx8fDA%3D",
  },
  {
    n: "Home Made",
    i: "https://images.unsplash.com/photo-1742599361489-a29ca87f92a9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHZlZyUyMHdpdGglMjB3aGl0ZSUyMGJhY2tncm91bmQlMjBpbiUyMGluZGlhbnxlbnwfh8w8MHx8fA%3D",
  },
  {
    n: "Momo",
    i: "https://media.istockphoto.com/id/1490878690/photo/gyoza-chinese-dumplings-isolated-fried-vegetable-jiaozi-chicken-momo-pile-asian-gyoza-group.jpg?s=612x612&w=0&k=20&c=XNJ4Cax1ktAdTEOM3mAj9hv2yQsGlc6ivxE7fuhkeOg=",
  },
];

const PizzaRow = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 p-4 max-w-5xl mx-auto">
    {items.map((it, idx) => (
      <div key={idx} className="group cursor-pointer text-center">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-2">
          <img
            src={it.i}
            alt={it.n}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        </div>
        <p className="text-xs font-medium text-gray-700 truncate">{it.n}</p>
      </div>
    ))}
  </div>
);

export default PizzaRow;
