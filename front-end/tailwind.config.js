/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    red: "#DC6691",
                    black: "#081225",
                    green: "#658F4E",
                    "bg-green": "#EDF9E7",
                    blue: "#207C96",
                    "bg-blue": "#E6F7FF",
                },
            },
        },
    },
    plugins: [],
};
