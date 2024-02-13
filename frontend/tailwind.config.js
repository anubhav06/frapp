/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '40': '40%',
      },
      aspectRatio: {
        'square': ['100%', '100%'],
      },
      color:{
        'primary':"#0ea5e9",
        'secondary': "#a78bfa",
        'backdrop': "#e0f2fe",
        'card': "#f0f9ff",
        "text":"#082f49",
        'text-primary':"#111827"
      },
      height:{
        '80':"80%",
        '60':'60%'
      }
    },
  },
  plugins: [],
}

