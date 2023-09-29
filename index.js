initPlayer({
  target: ".my-player",

  slides: [
    {
      url: "https://images.unsplash.com/photo-1584294311015-1bda86d6824d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      alt: "city",

      overlays: [
        {
          type: "text",
          value: "Привет",

          styles: {
            color: "orange",
            "font-size": "60px",
            "text-shadow": "1px 1px #000",

            top: "60%",
            left: "30%",

            transform: "rotate(-30deg)",
            animation: "scale 2s infinite ease-in-out",
          },
        },
        {
          type: "text",
          value: "мир",

          styles: {
            color: "orange",
            "font-size": "30px",
            "text-shadow": "1px 1px #000",

            bottom: "10%",
            right: "30%",

            transform: "rotate(90deg)",
            animation: "scale 6s infinite ease-in-out",
          },
        },
      ],
    },
    {
      url: "https://images.unsplash.com/photo-1604311795833-25e1d5c128c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1527&q=80",
      alt: "flower",
    },
    {
      url: "https://images.unsplash.com/photo-1590099914662-a76f2f83b802?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      alt: "forest",
    },
    {
      url: "https://images.unsplash.com/photo-1566895291281-ea63efd4bdbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1527&q=80",
      alt: "sea",
    },
  ],

  delayPerSlide: 5,
});
